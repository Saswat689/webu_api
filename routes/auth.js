const {
	registerUser,
	loginUser
} = require("../controllers/auth")
const router = require("express").Router();

const { registerUser, loginUser, protect } = require("../controllers/auth");
const express = require("express");
const router = express.Router();
//register
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

module.exports = router;
