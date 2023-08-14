const path = require("path");

module.exports = {
  dbUrl: `mongodb://jean:1234@localhost:27017/Twyttex_local?authSource=admin`,
  cert: path.join(__dirname, "../ssl/localhost.crt"),
  key: path.join(__dirname, "../ssl/localhost.key"),
};
