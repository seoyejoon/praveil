#!/bin/bash
# 무료 인증서(Let's Encrypt) 발급 + 최종 Nginx 설정 적용. 여러 번 실행해도 안전.
set -euo pipefail
DOMAIN="${DOMAIN:?}"
CONF="${CONF:-/tmp/praveil-nginx.conf}"
install -d /var/www/certbot
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "== 인증서 발급: $DOMAIN, www, admin"
  certbot certonly --webroot -w /var/www/certbot --non-interactive --agree-tos --register-unsafely-without-email \
    --cert-name "$DOMAIN" -d "$DOMAIN" -d "www.$DOMAIN" -d "admin.$DOMAIN"
fi
# 갱신될 때 Nginx 다시 읽기 (certbot 자동 갱신 타이머가 3개월마다 처리)
install -d /etc/letsencrypt/renewal-hooks/deploy
printf '#!/bin/sh\nsystemctl reload nginx\n' > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
echo "== 최종 Nginx 설정 적용"
cp -a /etc/nginx/sites-available/praveil-site /tmp/praveil-site.bak 2>/dev/null || true
install -m 644 "$CONF" /etc/nginx/sites-available/praveil-site
ln -sfn /etc/nginx/sites-available/praveil-site /etc/nginx/sites-enabled/praveil-site
if ! nginx -t; then
  echo "!! Nginx 설정 오류 → 이전 설정으로 되돌림"
  cp -a /tmp/praveil-site.bak /etc/nginx/sites-available/praveil-site
  nginx -t && systemctl reload nginx
  exit 1
fi
systemctl reload nginx
systemctl list-timers --no-pager | grep -i certbot || true
sleep 2
for u in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://admin.$DOMAIN/site-admin/login" "http://$DOMAIN/"; do
  curl -s -o /dev/null -w "$u -> %{http_code} %{redirect_url}\n" --resolve "$DOMAIN:443:127.0.0.1" --resolve "www.$DOMAIN:443:127.0.0.1" --resolve "admin.$DOMAIN:443:127.0.0.1" --resolve "$DOMAIN:80:127.0.0.1" "$u" || true
done
