const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");

//for error
const { errorHandle } = require("./middleware/errorMiddleware");

//for database connect
const connectDB = require("./config/db");
const router = require("./routes/user");
const postRouter = require("./routes/posts");

connectDB();

//gets port number from .env
const port = process.env.PORT || 5000;
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

app.use("/test", router);
app.use("/post", postRouter);
