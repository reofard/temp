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
        "http://localhost:5001/post/getPost"
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
          `http://localhost:5001/post/likePost/${id}`,
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
            //checks if array of likes contains users userId
            let containsName = !!e.likes.find((user: any) => {
              return user === getCookie("userId");
            });
            return (
              <>
                <Card className="container">
                  <div key={e._id} className="post ">
                    <p>{e.user}</p>
                    <h5>{e.title}</h5>
                    <h6>{e.subject}</h6>
                    <p key={e.content}>
                      {e.content.map((item: any, index: number) => {
                        // item이 https://로 시작하는 이미지 URL일 경우
                        if (item.startsWith('https://') && (item.endsWith('.jpg') || item.endsWith('.png') || item.endsWith('.jpeg') || item.endsWith('.gif'))) {
                          return <img key={index} src={item} alt={`image-${index}`} style={{ maxWidth: '100%', height: 'auto' }} />;
                        }
                        // 이미지가 아니면 텍스트로 처리
                        return <p key={index}>{item}</p>;
                      })}
                    </p>
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
    content: any[];
    comments: Array<String>;
    likes: Array<String>;
  }

  const [post, setPost] = useState<ICreatePost>({
    creator: `${getCookie("userId")}`,
    subject: "",
    title: "",
    content: [],
    comments: [],
    likes: [],
  });

  const handleImageUpload = async (event: SyntheticEvent) => {
    console.log("image upload start")
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    
    console.log(file)
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data: response } = await Axios.post(
          "http://localhost:5001/post/uploadImage",  // 백엔드에서 이미지를 처리하는 URL
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // 이미지 URL 반환
        return response.imageUrl;
      } catch (error) {
        console.log("Image upload failed", error);
      }
    }
  };


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const thePost = await Axios.post("http://localhost:5001/post/createPost", post);
      if (thePost) {
        console.log("Post created successfully");
        setPost({
          creator: getCookie("userId"),
          subject: "",
          title: "",
          content: [], // 초기화
          comments: [],
          likes: [],
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
        <div>
          {post.content.map((contentItem, index) => (
            <div key={index}>
              <Form.Control
                as="textarea"
                rows={3}
                value={contentItem}
                onChange={(e: any) => {
                  const newContent = [...post.content];
                  newContent[index] = e.target.value; // 배열 내 해당 항목 수정
                  setPost({ ...post, content: newContent });
                }}
              />
              <br />
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setPost({ ...post, content: [...post.content, ""] }); // 새로운 내용 항목 추가
          }}
        >
          Add Content
        </Button>
        <Button
          variant="secondary"
          onClick={() => document.getElementById("imageUploadInput")?.click()}  // 버튼 클릭 시 파일 선택 창 열기
        >
          Upload Image
        </Button>

        <input
          type="file"
          id="imageUploadInput"
          style={{ display: "none" }}  // 화면에 보이지 않게 숨기기
          accept="image/*"  // 이미지 파일만 선택 가능하게 설정
          onChange={async (e: any) => {
            const imageUrl = await handleImageUpload(e);  // 이미지 URL 받아오기
            if (imageUrl) {
              setPost({ ...post, content: [...post.content, imageUrl] });  // URL을 content에 추가
            }
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
