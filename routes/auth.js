const {

  registerUser,
  loginUser,
  protect,
  fbRedirect,
  fbGetLoginUrl,
} = require("../controllers/auth");

const router = require("express").Router();

const { registerUser, loginUser, protect } = require("../controllers/auth");

const express = require("express");
const router = express.Router();
//register
router.post("/register", registerUser);

//login
router.post("/login", loginUser);
// fb login url
router.post("/login/fb", fbGetLoginUrl);
// fb redirect /fb
router.get("/redirect/fb", fbRedirect);
module.exports = router;
