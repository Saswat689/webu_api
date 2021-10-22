const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const dompurify = createDomPurify(new JSDOM().window);

//create post
router.post('/',async (req,res) => {
	const post = {
		username: req.body.username,
		title: req.body.title,
		desc: req.body.desc,
		photo: req.body.photo
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
})

//update post
router.put('/:id',async (req,res) => {
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
})


//delete post
router.delete('/:id',async (req,res) => {
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
})



//get post
router.get('/:id', async (req,res) => {
	try{
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	}
	catch(err) {
		res.status(500).json(err);
	}
})


//get all posts
router.get('/', async (req,res) => {
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
})



module.exports = router;