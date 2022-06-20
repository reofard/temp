const PostModel = require("../model/postModel");

const createPost = async (req, res) => {
  try {
    //In creator token gets passed
    const { creator, subject, title, content, comments, likes } = req.body;

    if (!creator || !subject || !title || !content) {
      res.status(400).json({
        message: "Please enter all fields",
      });
      throw new Error("Please enter all fields");
    }

    const post = await PostModel.create({
      creator,
      subject,
      title,
      content,
      comments,
      likes,
    });

    if (post) {
      res.status(201).json({
        _id: post._id,
        creator: post.creator,
        subject: post.subject,
        title: post.title,
        content: post.content,
        comments: post.comments,
        likes: post.likes,
      });
    } else {
      res.status(400).json({
        message: "Invalid data",
      });
      console.log("error");
      throw new Error("invalid user data");
    }
  } catch (error) {
    res.status(400).json({
      message: "error",
    });

    console.log(error);
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await PostModel.find();

    if (posts) {
      res.status(201).json({
        posts,
      });
      console.log(posts.length);
    } else {
      res.status(401).json({
        message: "no data found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getMyPosts = async (req, res) => {
  try {
    // const posts = await PostModel.find({
    //   creator: `${req.user.id}`,
    // });

    // const posts = await PostModel.find({ creator: `${req.body.token}` });
    const posts = await PostModel.find({
      creator: `${req.body.token}`,
    });

    res.status(201).json({
      posts,
    });

    console.log(posts);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: `${error}`,
    });
  }
};

const deletePosts = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      throw new Error(`no post found`);
    }

    const deleteGoal = await PostModel.findByIdAndDelete(
      req.params.id,
      req.body
    );

    await post.remove();

    res.status(200).json({
      deleteGoal,
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

// add comments to posts
const addComment = async (req, res) => {
  console.log("put run");
  try {
    const post = await PostModel.findById(req.params.id);

    if (!posts) {
      res.status(400);
      throw new Error("Post not found");
    }

    //find the post by id and updates it content with a new body
    const addComment = await PostModel.findByIdAndUpdate(
      req.parms.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedGoal);

    console.log(post);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost, getPost, getMyPosts, addComment, deletePosts };
