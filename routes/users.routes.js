const router = require("express").Router();
const {
  userSignUp,
  userCreate,
  uploadProfileImage,
  userProfile,
  userList,
  followUser,
  unfollowUser,
  emailLinkVerification,
  initResetPassword,
  resetPasswordForm,
  resetPassword,
} = require("../controllers/user.controller");
const { ensureAuthenticated } = require("../config/guards.config");

router.get("/", userList);

router.get("/signup", userSignUp);
router.post("/signup", userCreate);

router.get("/email-verification/:userId/:token", emailLinkVerification);

router.post("/forgotten-password", initResetPassword);
router.get("/reset-password/:userId/:token", resetPasswordForm);
router.post("/reset-password/:userId/:token", resetPassword);

router.post("/update/image", ensureAuthenticated, uploadProfileImage);

router.get("/follow/:userId", followUser);
router.get("/unfollow/:userId", unfollowUser);

// router.get("/:username", userProfile);

module.exports = router;
