const app = require("../app");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const env = require(`../environment/${process.env.NODE_ENV}`);

app.use(
  session({
    secret: "qlsjkdhjkahzh475477",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
    store: MongoStore.create({
      mongoUrl: env.dbUrl,
      ttl: 60 * 60 * 24 * 14,
    }),
  })
);
