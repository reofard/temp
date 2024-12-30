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
      type: [Object],
      require: true,
    },
    comments: {
      type: [Object],
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
