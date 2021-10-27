const router = require("express").Router();
const Category = require("../models/Category");

exports.createCategory = async function (req,res) {
	const newCat = new Category(req.body);
	try{
		const savedCat = await newCat.save();
		res.status(200).json(savedCat);
	}
	catch(err) {
		res.status(500).json(err);
	}
}

exports.getAllCategories = async function (req,res) {
	try{
		const cats = await Category.find();
		res.status(200).json(cats);
	}
	catch(err) {
		res.status(500).json(err);
	}
}