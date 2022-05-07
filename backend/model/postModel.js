const mongoose = require("mongoose");

const postModel = mongoose.Schema(
  {
    creator: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    comments: {
      type: [String],
      require: false,
    },
    likes: {
      type: [String],
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postModel);
