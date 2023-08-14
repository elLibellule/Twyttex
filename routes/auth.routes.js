const router = require("express").Router();
const {
  sessionNew,
  sessionCreate,
  sessionDelete,
} = require("../controllers/auth.controller");

//   sessionDelete,
//   googleAuth,
//   googleAuthCb,

router.get("/login", sessionNew);
router.post("/login", sessionCreate);
router.get("/logout", sessionDelete);
// router.get("/google", googleAuth);
// router.get("/google/cb", googleAuthCb);

module.exports = router;
