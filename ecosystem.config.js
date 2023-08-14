module.exports = {
  apps: [
    {
      name: "twyttex",
      script: "./bin/www",
      watch: true,
      intances: "max",
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
