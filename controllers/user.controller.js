const {
  createUser,
  getUserByUsername,
  searchUsersByUsername,
  findUserById,
  addUserIdToCurrentUserFollowing,
  removeUserIdToCurrentUserFollowing,
  findUserByEmail,
  updatePassword,
} = require("../queries/user.queries");
const { getUserTweetsFromAuthorId } = require("../queries/tweet.queries");

const emailFactory = require("../emails");
const uuid = require("uuid");
const moment = require("moment");

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

exports.userList = async (req, res, next) => {
  try {
    const search = req.query.search;
    const users = await searchUsersByUsername(search);
    res.render("includes/search-menu", { users });
  } catch (err) {
    next(err);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await getUserByUsername(username);
    const tweets = await getUserTweetsFromAuthorId(user._id);
    res.render("tweets/tweet", {
      tweets,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user,
      editable: false,
    });
  } catch (err) {
    next(err);
  }
};

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
    emailFactory.SendEmailVerification({
      to: user.local.email,
      host: req.headers.host,
      username: user.username,
      userId: user._id,
      token: user.local.emailToken,
    });
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

exports.followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      addUserIdToCurrentUserFollowing(req.user, userId),
      findUserById(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      removeUserIdToCurrentUserFollowing(req.user, userId),
      findUserById(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.emailLinkVerification = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const user = await findUserById(userId);
    if (user && token && token === user.local.emailToken) {
      user.local.emailVerified = true;
      await user.save();
      res.redirect("/tweets");
    } else {
      res.status(400).json("Problem during email verification");
    }
  } catch (err) {
    next(err);
  }
};

exports.initResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await findUserByEmail(email);
      if (user) {
        user.local.passwordToken = uuid.v4();
        user.local.passwordTokenExpiration = moment()
          .add(10, "minutes")
          .toDate();
        await user.save();

        emailFactory.SendResetPasswordEmail({
          to: email,
          host: req.headers.host,
          username: user.username,
          userId: user._id,
          token: user.local.passwordToken,
        });

        res.status(204).end();
      } else {
        res.status(400).json("Unknown user");
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPasswordForm = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const user = await findUserById(userId);
    if (user && user.local.passwordToken === token) {
      res.render("auth/reset-password", {
        errors: null,
        isAthenticated: false,
        url: `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
      });
    } else {
      res.status(400).json("User does not exist");
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;
    const user = await findUserById(userId);
    if (
      password &&
      user &&
      user.local.passwordToken === token &&
      moment() < moment(user.local.passwordTokenExpiration)
    ) {
      updatePassword(user, password);
      res.redirect("/");
    } else {
      res.render("auth/reset-password", {
        errors: ["Une erreur est survenue"],
        isAthenticated: false,
        url: `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
      });
    }
  } catch (err) {
    next(err);
  }
};
