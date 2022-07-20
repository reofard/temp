const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  addComment,
  getMyPosts,
  deletePosts,
  likePost,
} = require("../controller/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/createPost", createPost);

router.get("/getPost", getPost);

router.put("/:id", addComment);

router.post("/myPosts", getMyPosts);

router.delete("/:id", deletePosts);

router.put("/addComment/:id", addComment);

router.put("/likePost/:id", likePost);

module.exports = router;
