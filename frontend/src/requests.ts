import Axios from "axios";


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