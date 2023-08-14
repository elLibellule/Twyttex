const passport = require("passport");

exports.sessionNew = async (req, res, next) => {
  res.render("auth/login-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.sessionCreate = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    } else if (!user) {
      res.render("auth/login-form", {
        errors: [info.message],
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    } else {
      req.login(user, (err) => {
        if (err) {
          next(err);
        } else {
          res.redirect("/tweets");
        }
      });
    }
  })(req, res, next);
};

exports.sessionDelete = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/auth/login");
  });
};

// exports.googleAuth = (req, res, next) => {
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })(req, res, next);
// };
// exports.googleAuthCb = (req, res, next) => {
//   passport.authenticate("google", {
//     successRedirect: "/chapters",
//     failureRedirect: "/",
//   })(req, res, next);
// };
