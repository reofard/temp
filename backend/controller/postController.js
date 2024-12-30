// 이미지 업로드 API
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: "AKIAZOZQFXGJ55AFONEO",
  secretAccessKey: "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",
  region: "ap-northeast-2",
});

// Multer 설정: 메모리 저장소 사용 (파일을 메모리에 버퍼로 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');  // 'file'은 프론트엔드에서 보낸 필드명

// 이미지 업로드 라우트
const uploadImageToS3 = async (req, res) => {
  // multer 미들웨어로 파일 파싱
  upload(req, res, async (err) => {
    if (err) {
      console.log('Multer error:', err);
      return res.status(400).json({ message: 'Error uploading file', error: err });
    }

    // 파일이 없으면 처리하지 않음
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 파일 파싱 후 업로드
    try {
      const file = req.file; // req.file은 multer에 의해 파싱된 파일 객체

      const fileName = Date.now() + path.extname(file.originalname); // 타임스탬프와 파일 확장자를 사용한 이름

      const params = {
        Bucket: "usooptiontown",
        Key: fileName,  // S3에서의 파일 이름
        Body: file.buffer,
        ContentType: file.mimetype, // 파일의 MIME 타입
      };

      // 파일을 S3에 업로드
      const uploadResult = await s3.upload(params).promise();

      // 업로드 후 S3 URL 반환
      return res.status(200).json({ imageUrl: uploadResult.Location });
    } catch (error) {
      console.log('S3 upload error:', error);
      return res.status(500).json({ message: 'Error uploading image to S3', error: error });
    }
  });
};

const PostModel = require("../model/postModel");

const createPost = async (req, res) => {
  try {
    //In creator token gets passed
    const { creator, subject, title, content, comments, likes } = req.body;

    // 로그 추가
    console.log('Request body:', req.body);
    
    if (!creator || !subject || !title || !content) {
      return res.status(400).json({
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
    console.log(post);
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
      console.log("error");
      return res.status(400).json({
        message: "Invalid data",
      });
    }
  } catch (error) {
    return res.status(400).json({
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
  uploadImageToS3,
  createPost,
  getPost,
  getMyPosts,
  addComment,
  deletePosts,
  likePost,
  dislikePost,
};
