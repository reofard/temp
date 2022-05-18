import { useEffect, useState } from "react";
import Axios from "axios";
const Posts = () => {
  const [posts, setPosts] = useState<Array<object>>([]);

  const getPosts = async () => {
    try {
      const allPosts = await Axios.get("http://localhost:5000/post/getPost");

      console.log(allPosts);
    } catch (error) {}
  };

  getPosts();

  return (
    <>
      <h2>Posts</h2>
    </>
  );
};

export default Posts;
