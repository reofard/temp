const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async () => {
  try {
    // 로컬 MongoDB URI
    const conn = await mongoose.connect(
      "mongodb://mongo:27017/forum-app", // 로컬 MongoDB URI
      {
        useNewUrlParser: true,
        useUnifiedTopology: true, // 안정적인 연결 옵션
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
