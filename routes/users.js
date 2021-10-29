const {
	updateUser,
	deleteUser,
	getUser
} = require("../controllers/users")
const router = require("express").Router();

//update user
router.put('/:id',updateUser)

//delete user
router.delete('/:id',deleteUser)

//get user
router.get('/:id',getUser)



module.exports = router;