import { useEffect, useState, SyntheticEvent } from "react";
import Axios from "axios";
import "../style/posts.css";
import { getCookie } from "../cookies";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { deletePost } from "../requests";

const Posts = () => {
  const [posts, setPosts] = useState<Array<Object>>([{}]);

  const [popUp, setPopUp] = useState<boolean>(false);

  const [postForm, setPostForm] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [options, setOptions] = useState<boolean>(false);

  const [comment, setComment] = useState<string>("");

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

  const createComment = (e: any) => {
    e.preventDefault();
    console.log(comment + 1);
    setComment("");
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
          ) : postForm ? (
            <CreatePost showFn={() => setPostForm(false)} />
          ) : (
            console.log("No creation")
          )}

          {posts.map((e: any) => {
            return (
              <div className="container">
                <div key={e._id} className="post border border-primary">
                  <p>{e.user}</p>
                  <h5>{e.title}</h5>
                  <h6>{e.subject}</h6>
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
                      value={comment}
                      onChange={(e: any) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={createComment}>
                      comment
                    </button>
                  </form>
                </div>
              </div>
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
      <Modal.Body>You need to be logged in to create a post</Modal.Body>
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
    comments: [" "],
    likes: [" "],
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
      </Form>
    </div>
  );
};

const PostOptions = (id: string) => {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="secondry">...</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            variant="danger"
            onClick={() => {
              deletePost(id);
            }}
          >
            Delete
          </Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("action 2")}>
            Another action
          </Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("action 3")}>
            Something else
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
