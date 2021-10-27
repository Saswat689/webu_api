const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


exports.registerUser = async function (req,res) {
	try{
		//hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password,salt);

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPass
		});

		const user = await newUser.save();
		console.log(user);
		res.status(200).json(user);
	}
	catch(err) {
		res.status(500).json(err);
	}
}

exports.loginUser = async function (req,res) {
	try{
		const user = await User.findOne({username: req.body.username});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "username not found"
			});
		}

		const validated = await bcrypt.compare(req.body.password,user.password);
		if (!validated) {
			return res.status(400).json({
				success: false,
				message: "password not found"
			})
		}
		const {password,...others} = user._doc;
		others.success = true
		res.status(200).json(others);
	}
	catch(err){
		res.status(500).json(err);
	}
}