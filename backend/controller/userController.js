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

    const user = await User.create({
      fname,
      lname,
      email,
      password,
    });
  } catch (error) {}
};
