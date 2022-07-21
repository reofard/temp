const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  addComment,
  getMyPosts,
  deletePosts,
  likePost,
  dislikePost,
} = require("../controller/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/createPost", createPost);

router.get("/getPost", getPost);

router.put("/:id", addComment);

router.post("/myPosts", getMyPosts);

router.delete("/:id", deletePosts);

router.put("/addComment/:id", addComment);

router.put("/likePost/:id", likePost);

router.put("/dislikePost/:id", dislikePost);

module.exports = router;
