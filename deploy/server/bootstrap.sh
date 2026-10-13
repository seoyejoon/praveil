#!/bin/bash
# 카페24 DEV A(2GB) 서버 기본 설정 — 여러 번 실행해도 안전 (이미 된 단계는 건너뜀)
# GitHub Actions(Server setup)에서 root로 실행. 비밀값은 서버 안에서만 만들고 화면에 출력하지 않음.
set -euo pipefail
DOMAIN="${DOMAIN:?}"
APPUSER=appuser
SECRETS=/etc/praveil
step() { echo; echo "== $*"; }

step "스왑 1.5GB 추가 (기본 0.5GB + 1.5GB)"
if [ ! -f /swapfile ]; then
  fallocate -l 1536M /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
sysctl -q vm.swappiness=10; echo 'vm.swappiness=10' > /etc/sysctl.d/99-praveil.conf
swapon --show

step "PostgreSQL 2GB용 메모리 설정"
cat > /etc/postgresql/17/main/conf.d/praveil.conf <<'PG'
shared_buffers = 128MB
effective_cache_size = 512MB
work_mem = 4MB
maintenance_work_mem = 64MB
max_connections = 30
listen_addresses = 'localhost'
PG
systemctl restart postgresql@17-main

step "비밀값 (처음 한 번만 생성, 서버에만 저장)"
install -d -m 750 -o root -g "$APPUSER" "$SECRETS"
if [ ! -f "$SECRETS/secrets.env" ]; then
  hex() { openssl rand -hex 32; }
  umask 077
  cat > "$SECRETS/secrets.env" <<S
ADMIN_DB_PASSWORD=$(hex)
WEB_DB_PASSWORD=$(hex)
INQUIRY_ENCRYPTION_KEY=$(hex)
ANALYTICS_HASH_KEY=$(hex)
APPOINTMENT_HASH_KEY=$(hex)
REVALIDATE_SECRET=$(hex)
S
  umask 022
fi
chmod 600 "$SECRETS/secrets.env"
# shellcheck disable=SC1091
. "$SECRETS/secrets.env"

step "DB · 계정"
sudo -u postgres psql -qtAc "SELECT 1 FROM pg_roles WHERE rolname='psbox_admin'" | grep -q 1 \
  || sudo -u postgres psql -qc "CREATE ROLE psbox_admin LOGIN PASSWORD '$ADMIN_DB_PASSWORD';"
sudo -u postgres psql -qtAc "SELECT 1 FROM pg_database WHERE datname='psbox_admin'" | grep -q 1 \
  || sudo -u postgres psql -qc "CREATE DATABASE psbox_admin OWNER psbox_admin;"
echo "psbox_admin 준비됨"

step "관리자 · 홈페이지 설정 파일"
install -d -o "$APPUSER" -g "$APPUSER" /opt/psbox-admin-only /opt/psbox-admin-only/storage/uploads /opt/psbox-admin-only/storage/protected-before-after /opt/praveil/releases
install -d -m 0755 /opt/psbox-admin-only/var/locks
touch /opt/psbox-admin-only/var/locks/media-snapshot-admission-v131.lock /opt/psbox-admin-only/var/locks/media-snapshot-v131.lock
chmod 0644 /opt/psbox-admin-only/var/locks/*.lock
umask 077
cat > /opt/psbox-admin-only/.env.local <<A
DATABASE_URL=postgresql://psbox_admin:$ADMIN_DB_PASSWORD@127.0.0.1:5432/psbox_admin
SITE_NAME=프라베일 맑고고운의원
SITE_SLUG=praveil
INQUIRY_ENCRYPTION_KEY=$INQUIRY_ENCRYPTION_KEY
ANALYTICS_HASH_KEY=$ANALYTICS_HASH_KEY
APPOINTMENT_HASH_KEY=$APPOINTMENT_HASH_KEY
NEXT_PUBLIC_WEBSITE_URL=https://$DOMAIN
NEXT_PUBLIC_PREVIEW_ORIGIN=https://admin.$DOMAIN
NEXT_PUBLIC_APP_URL=https://admin.$DOMAIN
PUBLIC_ORIGIN=https://admin.$DOMAIN
PRIMARY_APP_HOSTS=admin.$DOMAIN
UPLOAD_DIR=/opt/psbox-admin-only/storage/uploads
PROTECTED_UPLOAD_DIR=/opt/psbox-admin-only/storage/protected-before-after
MEDIA_SNAPSHOT_LOCK_ROOT=/opt/psbox-admin-only/var/locks
TRUST_PROXY_HEADERS=true
HOMEPAGE_REVALIDATE_URL=http://127.0.0.1:3000/api/revalidate
HOMEPAGE_REVALIDATE_SECRET=$REVALIDATE_SECRET
A
cat > /opt/praveil/.env.web <<W
DATABASE_URL=postgresql://praveil_web:$WEB_DB_PASSWORD@127.0.0.1:5432/psbox_admin
REVALIDATE_SECRET=$REVALIDATE_SECRET
W
umask 022
chown "$APPUSER:$APPUSER" /opt/psbox-admin-only/.env.local /opt/praveil/.env.web
chmod 600 /opt/psbox-admin-only/.env.local /opt/praveil/.env.web
chown -R "$APPUSER:$APPUSER" /opt/psbox-admin-only/storage
chmod o+x /opt /opt/praveil /opt/psbox-admin-only /opt/psbox-admin-only/storage
chmod -R o+rX /opt/psbox-admin-only/storage/uploads
echo "설정 파일 작성됨 (내용은 출력하지 않음)"

step "Nginx: $DOMAIN · www · admin (인증서 받기 전 HTTP 단계)"
install -d /var/www/certbot
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  cat > /etc/nginx/sites-available/praveil-site <<N
server {
  listen 80;
  server_name $DOMAIN www.$DOMAIN admin.$DOMAIN;
  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host \$host; proxy_set_header X-Forwarded-Proto \$scheme; proxy_set_header X-Forwarded-For \$remote_addr; }
}
N
  ln -sfn /etc/nginx/sites-available/praveil-site /etc/nginx/sites-enabled/praveil-site
fi
nginx -t && systemctl reload nginx

step "DB 자동 백업 (매일 새벽 4시, 14일 보관)"
install -d -m 700 /var/backups/praveil
cat > /etc/cron.d/praveil-backup <<'C'
0 4 * * * postgres pg_dump -Fc psbox_admin > /var/backups/praveil/psbox_admin-$(date +\%Y\%m\%d).dump 2>/dev/null; find /var/backups/praveil -name '*.dump' -mtime +14 -delete
C
chown postgres /var/backups/praveil
ls /etc/cron.d/praveil-backup

step "카페24 기본 주소(mycafe24.com)는 praveil.com 으로 이동 (같은 내용이 두 주소에 뜨지 않게)"
CAFE=/etc/nginx/sites-available/praveil
if [ -f "$CAFE" ] && [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ] && ! grep -q "return 301 https://$DOMAIN" "$CAFE"; then
  cp -a "$CAFE" /root/cafe24-default-site.bak
  python3 - "$CAFE" "$DOMAIN" <<'PY'
import re,sys
p,d=sys.argv[1],sys.argv[2]
s=open(p).read()
# 443 서버 블록의 첫 location 앞에 전체 이동 한 줄을 넣음
s=s.replace("    # --- Welcome fallback ---", f"    return 301 https://{d}$request_uri;\n    # --- Welcome fallback ---",1)
open(p,'w').write(s)
PY
  if ! nginx -t 2>/dev/null; then cp -a /root/cafe24-default-site.bak "$CAFE"; echo "되돌림"; fi
  systemctl reload nginx
fi

step "상태"
free -m; df -h / | tail -1
