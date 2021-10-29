const {
  createCategory,
  getAllCategories,
} = require("../controllers/categories");

const express = require("express");
const router = express.Router();
//create a new catgeory
router.post("/", createCategory);

//get all categories

router.get("/", getAllCategories);

module.exports = router;
