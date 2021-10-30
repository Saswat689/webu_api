const {
	updateUser,
	deleteUser,
	getUser
} = require("../controllers/users")
const router = require("express").Router();

const { updateUser, deleteUser, getUser } = require("../controllers/users");

const express = require("express");
const router = express.Router();
//update user
router.put("/:id", updateUser);

//delete user
router.delete('/:id',deleteUser)

router.delete("/:id", deleteUser);

//get user
router.get("/:id", getUser);

module.exports = router;
