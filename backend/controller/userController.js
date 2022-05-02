const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) {
      res.status(400);
      throw new Error("Please enter all fields");
    }

    //check if user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("User already exists");
    }

    //hash password
    //encrypts password user enters
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json({
        _id: user.id,
        firstName: user.fname,
        lastName: user.lname,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {}
};

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser };
