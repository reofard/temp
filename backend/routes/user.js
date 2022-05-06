const express = require("express");
const router = express.Router();

const { registerUser, getUser } = require("../controller/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.get("/login", getUser);

module.exports = router;
