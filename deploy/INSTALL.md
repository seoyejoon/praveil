# 카페24 서버 설치 순서 (홈페이지 + 관리자)

서버 한 대(DEV A, 2GB)에 **홈페이지 · 관리자 · DB**를 함께 설치합니다.
명령어는 서버에 SSH로 접속해서 위에서부터 차례대로 붙여 넣으면 됩니다. (Ubuntu 기준, Rocky Linux는 `apt` 대신 `dnf`)

```
praveil.co.kr        → 홈페이지 (포트 3000)
admin.praveil.co.kr  → 관리자   (포트 3100)
praveil.co.kr/admin  → 관리자 로그인으로 자동 이동
두 곳 모두 같은 PostgreSQL DB 사용 (홈페이지는 읽기 전용 계정)
```

> 도메인이 바뀌면 아래 명령과 `deploy/nginx/praveil.conf` 안의 `praveil.co.kr` 만 바꾸면 됩니다.

---

## 0. 도메인 연결 (도메인 업체 사이트에서)

DNS에 A 레코드 3개를 서버 IP로 등록합니다: `praveil.co.kr`, `www`, `admin`

## 1. 기본 프로그램 설치

```sh
# 메모리 여유용 스왑 2GB (관리자 빌드할 때 필요)
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Node.js 24, PM2, Nginx, PostgreSQL, certbot
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql certbot python3-certbot-nginx git
sudo npm install -g pm2
```

PostgreSQL 메모리 설정: `deploy/postgresql-2gb.conf` 내용을 `/etc/postgresql/*/main/postgresql.conf` 맨 아래에 붙여 넣고 `sudo systemctl restart postgresql`

## 2. DB 만들기

```sh
sudo -u postgres psql -c "CREATE ROLE psbox_admin LOGIN PASSWORD '관리자DB비밀번호';"
sudo -u postgres psql -c "CREATE DATABASE psbox_admin OWNER psbox_admin;"
```

## 3. 관리자 설치

```sh
sudo mkdir -p /opt/psbox-admin-only && sudo chown $USER /opt/psbox-admin-only
git clone -b praveil https://github.com/seoyejoon/psbox-admin-only /opt/psbox-admin-only
cd /opt/psbox-admin-only
cp .env.example .env.local   # 아래 "관리자 설정값" 참고해서 채우기
nano .env.local

npm ci
npm run db:init          # 빈 DB에 기본 테이블 + 관리자 계정 생성
npm run praveil:setup    # 프라베일 전용 테이블 + 시술 54종 · 병원 정보 · 게시판 초기값
mkdir -p storage/uploads storage/protected-before-after
sudo install -d -o root -g root -m 0755 /opt/psbox-admin-only/var/locks
sudo touch /opt/psbox-admin-only/var/locks/media-snapshot-admission-v131.lock /opt/psbox-admin-only/var/locks/media-snapshot-v131.lock
sudo chmod 0644 /opt/psbox-admin-only/var/locks/*.lock
chmod o+x /opt/psbox-admin-only /opt/psbox-admin-only/storage && chmod -R o+rX storage/uploads   # Nginx가 이미지 읽기
npm run build
```

**관리자 설정값 (.env.local)** — 비밀값은 `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` 로 하나씩 새로 만듭니다.

```
DATABASE_URL=postgresql://psbox_admin:관리자DB비밀번호@127.0.0.1:5432/psbox_admin
ADMIN_USER=praveil
ADMIN_EMAIL=병원이메일
ADMIN_PASSWORD=첫로그인비밀번호(12자이상)   ← db:init 후 지워도 됨
SITE_NAME=프라베일 맑고고운의원
SITE_SLUG=praveil
INQUIRY_ENCRYPTION_KEY=새비밀값   ← 절대 바꾸거나 잃어버리지 말 것 (따로 보관)
ANALYTICS_HASH_KEY=새비밀값
APPOINTMENT_HASH_KEY=새비밀값
NEXT_PUBLIC_WEBSITE_URL=https://praveil.co.kr
NEXT_PUBLIC_PREVIEW_ORIGIN=https://admin.praveil.co.kr
NEXT_PUBLIC_APP_URL=https://admin.praveil.co.kr
PUBLIC_ORIGIN=https://admin.praveil.co.kr
PRIMARY_APP_HOSTS=admin.praveil.co.kr
UPLOAD_DIR=/opt/psbox-admin-only/storage/uploads
PROTECTED_UPLOAD_DIR=/opt/psbox-admin-only/storage/protected-before-after
MEDIA_SNAPSHOT_LOCK_ROOT=/opt/psbox-admin-only/var/locks
TRUST_PROXY_HEADERS=true
HOMEPAGE_REVALIDATE_URL=http://127.0.0.1:3000/api/revalidate
HOMEPAGE_REVALIDATE_SECRET=새비밀값(아래 홈페이지 REVALIDATE_SECRET 과 같은 값)
```

## 4. 홈페이지 설치

```sh
# 홈페이지용 읽기 전용 DB 계정
sudo -u postgres psql -d psbox_admin -v pw="'홈페이지DB비밀번호'" -f 이_저장소의/deploy/sql/readonly-user.sql

sudo mkdir -p /opt/praveil/releases && sudo chown -R $USER /opt/praveil
cp deploy/ecosystem.config.cjs /opt/praveil/ecosystem.config.cjs
cat > /opt/praveil/.env <<'EOF'
DATABASE_URL=postgresql://praveil_web:홈페이지DB비밀번호@127.0.0.1:5432/psbox_admin
REVALIDATE_SECRET=관리자의 HOMEPAGE_REVALIDATE_SECRET 과 같은 값
EOF
chmod 600 /opt/praveil/.env
```

홈페이지 파일은 GitHub Actions가 빌드해서 올립니다. (`.github/workflows/deploy.yml`)
GitHub 저장소 → Settings → Secrets and variables → Actions 에 등록:

| 종류 | 이름 | 값 |
|---|---|---|
| Variable | `NEXT_PUBLIC_SITE_URL` | `https://praveil.co.kr` |
| Variable | `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오맵 키 (있을 때) |
| Secret | `DEPLOY_HOST` | 서버 IP |
| Secret | `DEPLOY_USER` | 서버 접속 계정 |
| Secret | `DEPLOY_SSH_KEY` | 서버 접속용 SSH 개인키 |

그다음 Actions 탭 → **Deploy homepage** → Run workflow. 끝나면 `/opt/praveil/current` 에 홈페이지가 들어갑니다.

## 5. 실행 + 주소 연결 + SSL

```sh
pm2 start /opt/praveil/ecosystem.config.cjs
pm2 save && pm2 startup   # 서버 재부팅 시 자동 실행 (안내되는 명령 한 줄 더 실행)

sudo cp deploy/nginx/praveil.conf /etc/nginx/sites-available/praveil.conf
sudo ln -s /etc/nginx/sites-available/praveil.conf /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot
# 인증서 발급 (처음 한 번은 praveil.conf 를 잠시 빼고 발급한 뒤 다시 넣어도 됩니다)
sudo certbot certonly --webroot -w /var/www/certbot -d praveil.co.kr -d www.praveil.co.kr -d admin.praveil.co.kr
sudo nginx -t && sudo systemctl reload nginx
```

## 6. 확인

- https://praveil.co.kr → 홈페이지
- https://praveil.co.kr/admin → 관리자 로그인으로 이동
- 관리자에서 **병원 정보·진료시간**의 전화번호를 바꾸고 저장 → 홈페이지 하단에 바로 바뀌면 연결 완료
- `pm2 status` 로 두 개(praveil-web, praveil-admin)가 online 인지, `free -m` 으로 메모리 확인

## 업데이트할 때

- **홈페이지**: main 브랜치에 올리면 자동 배포 (또는 Actions에서 Run workflow)
- **관리자**: `cd /opt/psbox-admin-only && git pull && npm ci && npm run praveil:setup && npm run build && pm2 reload praveil-admin`
