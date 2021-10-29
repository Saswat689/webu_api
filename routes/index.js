const express = require("express");
const router = express.Router();
const {
	postComment
} = require("../controllers/index")

router.post('/comment',postComment)

module.exports = router