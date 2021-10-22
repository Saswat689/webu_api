const router = require("express").Router();
const {
	createPost,
	updatePost,
	deletePost,
	getSinglePost,
	getAllPosts
} = require("../controllers/posts")
const { uploadImage } = require("../utils/multerconfig")
const checkUploadErrors = require("../middlewares/checkUploadErrors")

//create post
router.post('/',
	[
    uploadImage.single("postImage"),
    function (req, res, next) {
      if (!req.file) {
        return res.status(422).json({
          message: "Post image is required",
          success: false,
        });
      }
      next();
    },
  ],
  checkUploadErrors,
  createPost
)

//update post
router.put('/:id',updatePost)


//delete post
router.delete('/:id',deletePost)



//get post
router.get('/:id/:title',getSinglePost)


//get all posts
router.get('/',getAllPosts)



module.exports = router;