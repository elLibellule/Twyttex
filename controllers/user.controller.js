const { createUser } = require("../queries/user.queries");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/avatars"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-avatart.${file.originalname.split(".")[1]}`);
    },
  }),
});

exports.userSignUp = async (req, res, next) => {
  res.render("user/user-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await createUser(body, "local");
    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      res.redirect("/tweets");
    });
  } catch (err) {
    res.render("user/user-form", {
      error: [err.message],
      isAthenticated: req.isAthenticated(),
      currentUser: req.user,
    });
  }
};

exports.uploadProfileImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];
