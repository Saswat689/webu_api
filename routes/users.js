const {
	updateUser,
	deleteUser,
	getUser
} = require("../controllers/users")

//update user
router.put('/:id',updateUser)

//delete user
router.delete('/:id',)deleteUser

//get user
router.get('/:id',getUser)



module.exports = router;