module.exports = {
  apps: [{
    name: 'shrimptech-email-server',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Windows specific
    exec_mode: 'fork',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
