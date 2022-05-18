const express = require("express");
const router = express.Router();

const { registerUser, getUser } = require("../controller/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", getUser);

module.exports = router;
