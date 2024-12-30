const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");

//for error
const { errorHandle } = require("./middleware/errorMiddleware");

//for database connect
const connectDB = require("./config/db");
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");

connectDB();

//gets port number from .env
const port = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for errors
app.use(errorHandle);

app.use(
  cors({
    origin: "*",
  })
);

app.listen(port, () => {
  console.log(`Server started in port: ${port}`.bgGreen);
});

app.use("/user", userRouter);
app.use("/post", postRouter);

//to get user with id
app.post("/:id");
