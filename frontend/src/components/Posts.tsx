import { ReactElement, useEffect, useState } from "react";
import Axios from "axios";
import "../style/posts.css";
import { getCookie } from "../cookies";
import { Modal, Button } from "react-bootstrap";

const Posts = () => {
  const [posts, setPosts] = useState<Array<Object>>([{}]);

  const [popUp, setPopUp] = useState<boolean>(false);

  const getPosts = async () => {
    try {
      const { data: response } = await Axios.get(
        "http://localhost:5000/post/getPost"
      );

      setPosts(response.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = () => {
    if (!getCookie("user")) {
      console.log("you need to be logged in to create post");
      setPopUp(true);
    } else {
      console.log("post created");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <button className="btn btn-success" onClick={createPost}>
        Create post
      </button>

      {popUp ? <PopUpModal /> : console.log("Post creation")}

      {posts.map((e: any) => {
        return (
          <>
            <div
              className="container"
              onClick={() => {
                console.log(e._id);
                console.log(e.creator);
              }}
            >
              <div key={e._id} className="post border border-primary">
                <p>{e.user}</p>
                <p key={e.content}>{e.content}</p>
                <div>
                  <button className="like-btn btn btn-success">Like</button>
                </div>
              </div>

              <div className="comments">
                <p>{e.comments}</p>
              </div>

              <div className="form-group">
                <form className="comment-form">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Comment..."
                  />
                  <button className="btn btn-primary">comment</button>
                </form>
              </div>
            </div>
            <br />
          </>
        );
      })}
    </>
  );
};

export default Posts;

const PopUpModal: React.FC = (): ReactElement => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        I will not close if you click outside me. Don't even try to press escape
        key.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">Understood</Button>
      </Modal.Footer>
    </Modal>
  );
};
