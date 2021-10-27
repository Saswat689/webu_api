const {
	createCategory,
	getAllCategories
} = require("../controllers/categories")

//create a new catgeory
router.post('/',createCategory)

//get all categories

router.get('/',getAllCategories)


module.exports = router;