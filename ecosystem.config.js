module.exports = {
  apps : [
    {
      name: 'server',
      script: 'server.ts',
      interpreter: 'bun',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
        EDUCATOPIA_FEATURED_EXERCISES: '1871,1895,1910,1911',
      },
    },
  ],
}
