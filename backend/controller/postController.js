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
    //const post = await PostModel.findById(req.body.comment_id);
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      res.status(400);
      console.log("error, not fount");
      throw new Error("Post not found");
    } else {
      console.log(post);
    }

    //updates post using post id and pushes new data to array
    const comment = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: req.body.nc } }
    );

    res.status(200).json(comment);

    console.log(post);
  } catch (error) {
    console.log(error);
    console.log(`error occured`);
  }
};

const likePost = async (req, res) => {
  console.log(req.params.id);

  try {
    //looks for post
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      res.status(400).json({ message: "post not found" });
    }

    const like = await PostModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likes: req.body.userId } }
    );

    console.log(like);
    res.status(200).json(like);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
};

const dislikePost = async (req, res) => {
  try {
    //looks for post
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      res.status(400).json({ message: "post not found" });
    }

    const like = await PostModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: req.body.userId } }
    );

    console.log(like);
    res.status(200).json(like);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
};

module.exports = {
  createPost,
  getPost,
  getMyPosts,
  addComment,
  deletePosts,
  likePost,
  dislikePost,
};
