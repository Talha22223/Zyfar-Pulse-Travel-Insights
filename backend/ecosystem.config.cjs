module.exports = {
  apps: [{
    name: 'zyfar-pulse',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      DATA_DIR: '/var/zyfar_pulse/data',
      CORS_ORIGIN: 'https://zyfar-pulse-travel-insights-fronten.vercel.app'
    },
    error_file: '/var/log/zyfar-pulse-error.log',
    out_file: '/var/log/zyfar-pulse-out.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 10
  }]
};
