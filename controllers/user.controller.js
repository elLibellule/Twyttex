const {
  createUser,
  getUserByUsername,
  searchUsersByUsername,
  findUserById,
  addUserIdToCurrentUserFollowing,
  removeUserIdToCurrentUserFollowing,
} = require("../queries/user.queries");
const { getUserTweetsFromAuthorId } = require("../queries/tweet.queries");
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
