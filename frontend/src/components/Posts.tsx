import { useEffect, useState, SyntheticEvent } from "react";
import Axios from "axios";
import "../style/posts.css";
import { getCookie } from "../cookies";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { deletePost, dislikePost, addComment } from "../requests";

import Card from "react-bootstrap/Card";

const Posts = () => {
  const [posts, setPosts] = useState<Array<Object>>([{}]);

  const [popUp, setPopUp] = useState<boolean>(false);

  const [postForm, setPostForm] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [options, setOptions] = useState<boolean>(false);

  const [comment, setComment] = useState<string>("");

  //tempHold For comments
  const [postComments, setPostComments] = useState<Array<string>>([]);

  //btn status
  const [btnStatus, setBtnStatus] = useState<string>("like");

  //btn styling state
  const [likeBtnStyle, setLikeBtnStyle] = useState("like-btn btn btn-success");

  //object to add to comment array
  interface IaddComment {
    comment: string;
    creator: string;
  }

  const [newComment, setNewComment] = useState<IaddComment>({
    comment: comment,
    creator: getCookie("user"),
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const getPosts = async () => {
    try {
      const { data: response } = await Axios.get(
        "http://localhost:5000/post/getPost"
      );

      setPosts(response.posts);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = () => {
    if (!getCookie("user")) {
      setPopUp(true);
    } else {
      setPostForm(true);
    }
  };

  const likePost = async (id: string) => {
    try {
      if (!getCookie("user")) {
        setPopUp(true);
      } else {
        const { data: response } = await Axios.put(
          `http://localhost:5000/post/likePost/${id}`,
          { userId: getCookie("userId") }
        );

        console.log(response);
        console.log("Post liked");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <button className="btn btn-success" onClick={createPost}>
            Create post
          </button>
          <br />
          <br />
          <br />

          {/* When logged in create post form appears else a popup appears asking you to log in */}
          {popUp ? (
            <PopUpModal
              showFn={() => {
                setPopUp(false);
              }}
            />
          ) : (
            postForm && <CreatePost showFn={() => setPostForm(false)} />
          )}

          {posts.map((e: any) => {
            let likes = e.likes;

            return (
              <>
                <Card className="container">
                  <div key={e._id} className="post ">
                    <p>{e.user}</p>
                    <h5>{e.title}</h5>
                    <h6>{e.subject}</h6>
                    <p key={e.content}>{e.content}</p>
                    <div className="d-flex ">
                      {e.likes.length !== 0 ? (
                        <button
                          className="like-btn btn btn-danger"
                          onClick={() => dislikePost(e._id)}
                        >
                          Dislike
                        </button>
                      ) : (
                        <button
                          className="like-btn btn btn-success"
                          onClick={() => likePost(e._id)}
                        >
                          Like
                        </button>
                      )}

                      <p>{e.likes.length}</p>
                    </div>
                  </div>

                  <div>
                    <p>
                      {e.comments.map((c: any) => {
                        return <p>{c.comment}</p>;
                      })}
                    </p>
                  </div>

                  <div className="form-group">
                    <form className="comment-form" id="form">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Comment..."
                        onChange={(e: any) => {
                          setComment(e.target.value);
                          setNewComment({
                            ...newComment,
                            comment: e.target.value,
                          });
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={(event: any) => {
                          event.preventDefault();
                          if (!getCookie("user")) {
                            setPopUp(true);
                          } else {
                            event.preventDefault();
                            setPostComments(e.comments);

                            addComment(e._id, newComment);
                            console.log(newComment);
                          }
                        }}
                      >
                        Comment
                      </button>
                    </form>
                  </div>
                </Card>
                <br />
              </>
            );
          })}
        </>
      )}
    </>
  );
};

export default Posts;

const PopUpModal = (props: { showFn: () => void }) => {
  const navigate = useNavigate();

  return (
    <Modal show={true} onHide={props.showFn} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>You need to be logged in to create or like a post</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.showFn}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            navigate("/login");
          }}
        >
          Log In
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CreatePost = (props: { showFn: () => void }) => {
  interface ICreatePost {
    creator: string;
    subject: string;
    title: string;
    content: string;
    comments: Array<String>;
    likes: Array<String>;
  }

  const [post, setPost] = useState<ICreatePost>({
    creator: `${getCookie("userId")}`,
    subject: "",
    title: "",
    content: "",
    comments: [],
    likes: [],
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      let thePost = await Axios.post(
        "http://localhost:5000/post/createPost",
        post
      );
      if (thePost) {
        console.log("posted created");
        setPost({
          creator: `${getCookie("user")}`,
          subject: "",
          title: "",
          content: "",
          comments: [""],
          likes: [""],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <br />
      <Form>
        <Form.Select
          aria-label="Default select example"
          value={post.subject}
          onChange={(e: any) => {
            setPost({ ...post, subject: e.target.value });
            console.log(e.target.value);
          }}
        >
          <option>Subject</option>
          <option value="Technology">Technology</option>
          <option value="TV/Movies">TV/Movies</option>
          <option value="Sports">Sports</option>
          <option value="Random">Random</option>
          <option value="School">School</option>
          <option value="Personal">Personal</option>
          <option value="Advice">Advice</option>
        </Form.Select>

        <br />
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={post.title}
          placeholder="Title..."
          onChange={(e: any) => {
            setPost({ ...post, title: e.target.value });
          }}
        />
        <br />
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={post.content}
          placeholder="Content..."
          onChange={(e: any) => {
            setPost({ ...post, content: e.target.value });
          }}
        />

        <br />
        <Button variant="success" onClick={handleSubmit}>
          Create
        </Button>
        <Button variant="danger" onClick={props.showFn}>
          Close
        </Button>
      </Form>{" "}
      <br />
    </div>
  );
};
