const router = require("express").Router();
const {
  userSignUp,
  userCreate,
  uploadProfileImage,
} = require("../controllers/user.controller");
const { ensureAuthenticated } = require("../config/guards.config");

router.get("/signup", userSignUp);
router.post("/signup", userCreate);

router.post("/update/image", ensureAuthenticated, uploadProfileImage);

module.exports = router;
