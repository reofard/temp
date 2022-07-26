import Axios from "axios";
import { getCookie } from "./cookies";


export const deletePost = async(id:string)=>{
    try {
        const post = await Axios.delete(`http://localhost:5000/post/${id}`)
        if(post){
            console.log("Post deleted");
        }
    } catch (error) {
        console.log(error);       
    }
}

  export const dislikePost = async (id: string) => {
    try {
      const { data: response } = await Axios.put(
        `http://localhost:5000/post/dislikePost/${id}`,
        //user id getting removed from likes array
        { userId: getCookie("userId") }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

// export const getUserNames = async(id:string)=>{

// }

  export const addComment = async (id: string, newComment:any) => {
    const value = { nc: newComment, comment_id: id };

    console.log(id);

    try {
      const { data: response } = await Axios.put(
        `http://localhost:5000/post/addcomment/${id}`,
        value
      );

      console.log("comment added");
      id = "";
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };