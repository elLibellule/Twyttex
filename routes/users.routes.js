const router = require("express").Router();
const {
  userSignUp,
  userCreate,
  uploadProfileImage,
  userProfile,
  userList,
  followUser,
  unfollowUser,
} = require("../controllers/user.controller");
const { ensureAuthenticated } = require("../config/guards.config");

router.get("/", userList);

router.get("/signup", userSignUp);
router.post("/signup", userCreate);

router.get("/follow/:userId", followUser);
router.get("/unfollow/:userId", unfollowUser);

router.get("/:username", userProfile);

router.post("/update/image", ensureAuthenticated, uploadProfileImage);

module.exports = router;
