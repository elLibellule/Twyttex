const mongoose = require("mongoose");
const env = require(`../environment/${process.env.NODE_ENV}`);

mongoose
  .connect(env.dbUrl)
  .then(() => console.log("Connection successfully established"))
  .catch((err) => console.log(err));
