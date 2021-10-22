const User = require("../models/User");
const Post = require("../models/Post");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const url = require("url");
const { isValidObjectId } = require("mongoose");
const dompurify = createDomPurify(new JSDOM().window); //parsing markup

//get base url
function getBaseUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
  });
}

exports.createPost = async function (req,res) {
	const baseUrl = getBaseUrl(req);
	const post = {
		username: req.body.username,
		title: req.body.title,
		desc: req.body.desc,
		photo: `${baseUrl}/images/${req.file.filename}` //multer populates the req with filename
	}
	post.sanitizedHtml = dompurify.sanitize(marked(req.body.desc));
	const newPost = new Post(post);
	try{
		const savedPost = await newPost.save();
		const {sanitizedHtml,...others} = savedPost._doc;
		res.status(200).json(others);
	}
	catch(err) {
		res.status(500).json(err);
	}
}

exports.updatePost = async function(req,res) {
	if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
        success: false,
      });
    }
	try{
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try{
				const updatedDesc = await Post.findByIdAndUpdate(req.params.id,{
					username: req.body.username,
					title: req.body.title,
					desc: req.body.desc,
					sanitizedHtml: dompurify.sanitize(marked(req.body.desc))
				},{ new: true })
				const {sanitizedHtml,...others} = updatedDesc;
				res.status(200).json(others);
			}
			catch(err) {
				res.status(500).json(err);
			}
		} else {
			res.status(201).json("You can update only your post");
		}
	}
	catch(err){
		res.status(500).json(err);
	}
}

exports.deletePost = async function (req,res) {
	if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
        success: false,
      });
    }
	try{
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try{
				await post.delete();
				res.status(200).json("Post has been deleted");
			}
			catch(err) {
				res.status(500).json(err);
			}
		} else {
			res.status(201).json("You can delete only your post");
		}
	}
	catch(err){
		res.status(500).json(err);
	}
}

exports.getSinglePost = async function (req,res) {
	if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
        success: false,
      });
    }
	try{
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	}
	catch(err) {
		res.status(500).json(err);
	}
}

exports.getAllPosts = async function (req,res) {
	const username = req.query.user;
	const catName = req.query.cat;
	try{
		let posts;
		if (username) {
			posts = await Post.find({username: username})
		}
		else if (catName) {
			posts = await Post.find({categories: {
				$in:[catName] //check if the given category exists in db
		}})}
		else {
			posts = await Post.find();
		}
			res.status(200).json(posts);
	}
	catch(err) {
		res.status(500).json(err);
	}
}