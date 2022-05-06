const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../model/userModel");

const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) {
      res.status(400).json({
        message: "Please enter all fields",
      });
      throw new Error("Please enter all fields");
    }

    //check if user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400).json({
        message: "user already exits",
      });
      throw new Error("User already exists");
    }

    console.log("register is contiuing");

    //hash password
    //encrypts password user enters
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("hashed passed");

    const user = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    console.log("created passed");

    if (user) {
      res.status(200).json({
        _id: user._id,
        firstName: user.fname,
        lastName: user.lname,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Invalid data",
      });
      console.log("error");
      throw new Error("invalid user data");
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checks database if email exists
    const user = await User.findOne({ email });

    /**
     * if the users exists
     * it compares the password the user input to the real account password
     */

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(201).json({
        _id: user.id,
        fname: user.fname,
        lname: user.lname,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      res.json("invalid user");
      throw new Error("invalid user data");
    }
  } catch (error) {
    res.status(400).json({
      login: false,
    });
  }
};

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "abc1234", {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, getUser };
