// PM2 실행 설정 (2GB 서버 기준 메모리 제한 포함)
// 사용: pm2 start /opt/praveil/deploy/ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      // 홈페이지: GitHub Actions 에서 빌드한 standalone 결과물을 실행
      name: "praveil-web",
      cwd: "/opt/praveil/current",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
        NODE_OPTIONS: "--max-old-space-size=256",
      },
      // DATABASE_URL, REVALIDATE_SECRET 은 /opt/praveil/.env 에서 읽는다
      node_args: "--env-file=/opt/praveil/.env",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "380M",
      kill_timeout: 5000,
      time: true,
    },
    {
      // 관리자: /opt/psbox-admin-only 에서 npm run build 후 실행 (설정은 .env.local)
      name: "praveil-admin",
      cwd: "/opt/psbox-admin-only",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3100",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--max-old-space-size=384",
      },
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "520M",
      kill_timeout: 5000,
      time: true,
    },
  ],
};
