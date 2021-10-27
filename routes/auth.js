const {
	registerUser,
	loginUser
} = require("../controllers/auth")

//register
router.post('/register',registerUser)

//login
router.post('/login',loginUser)

module.exports = router;