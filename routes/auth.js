const {
	registerUser,
	loginUser
} = require("../controllers/auth")
const router = require("express").Router();

//register
router.post('/register',registerUser)

//login
router.post('/login',loginUser)

module.exports = router;