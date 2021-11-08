const {
  registerUser,
  loginUser,
  protect,
  fbRedirect,
  fbGetLoginUrl,
  googleRedirect,
  getGoogleLoginUrl,
} = require("../controllers/auth");

const express = require("express");
const router = express.Router();
//register
router.post("/register", registerUser);

//login
router.post("/login", loginUser);
// fb login url
router.get("/login/fb", fbGetLoginUrl);
// fb redirect /fb
router.get("/redirect/fb", fbRedirect);
// google login link
router.get("/login/google", getGoogleLoginUrl);
// google redirect
router.get("/google", googleRedirect);

module.exports = router;
