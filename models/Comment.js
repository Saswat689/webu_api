const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: true
	},
	post: {
		type: Object,
		required: true
	},

})

module.exports = mongoose.model("Comment",CommentSchema);