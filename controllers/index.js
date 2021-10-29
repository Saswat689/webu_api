const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose")
const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.postComment = async function (req,res) {
	try{	
		const { comment,postId } = req.body;
	if (!isValidObjectId(postId)) {
		return res.status(400).json({
			message: "Invalid post Id",
			success: false
		})
	}
	const post = await Post.findById(postId).select("username profilePic").exec();

	if (!post) {
		return res.status(400).json({
			message: "No post found with the given object id",
			success: false
		})

	}
		const newComment = new Comment({
			comment: comment,
			post: post
		})

		const result = await newComment.save();

		return res.status(200).json({
			commentInfo: result,
			message: "comment published successfully",
			success: true
		})
	}	
	catch(e) {
		console.log(e);
		return res.status(500).json({
			message: "Some error occured",
			success: false
		})
	}

}