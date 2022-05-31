const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  addComment,
} = require("../controller/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/createPost", createPost);

router.get("/getPost", getPost);

router.put("/:id", addComment);

module.exports = router;
