const app = require("../app");
const errorHandler = require("errorhandler");

const env = process.env.NODE_ENV;

if (env === "development") {
  app.use(errorHandler());
}

app.use((err, req, res, next) => {
  if (env === "production") {
    res.status(500).render("error", {
      error: {
        code: err.code || 500,
        message: err.message,
      },
    });
  }
});
