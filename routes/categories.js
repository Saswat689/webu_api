const {
	createCategory,
	getAllCategories
} = require("../controllers/categories");
const router = require("express").Router();

//create a new catgeory
router.post('/',createCategory)

//get all categories

router.get('/',getAllCategories)


module.exports = router;