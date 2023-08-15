module.exports = {
  apps: [
    {
      name: "twyttex",
      script: "./bin/www",
      watch: false,
      intances: "max",
      autorestart: false,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
