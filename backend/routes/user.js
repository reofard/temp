const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  getUser,
} = require("../controller/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/getUser", protect, getUser);

module.exports = router;
