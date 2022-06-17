import Axios from "axios";
import Header from "./Header";
import { getCookie } from "../cookies";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import Accordion from "react-bootstrap/Accordion";
import { Button, Dropdown } from "react-bootstrap";
import { deletePost } from "../requests";

const MyAccount = () => {
  interface ImyInfo {
    id: string;
    fName: string;
    lName: string;
    email: string;
  }

  const [myInfo, setMyinfo] = useState<ImyInfo>({
    id: "",
    fName: "",
    lName: "",
    email: "",
  });

  const [myPosts, setMyPosts] = useState<Array<object>>([{}]);

  const [loading, setLoading] = useState<boolean>(true);

  const myToken = getCookie("user");
  const myUserId = getCookie("userId");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  });

  //used for bearer toekn input
  const config = {
    headers: { Authorization: `Bearer ${myToken}` },
  };
  //gets user info with jwt token
  const getInfo = async () => {
    try {
      const { data: response } = await Axios.get(
        "http://localhost:5000/user/getUser/",
        config
      );

      setMyinfo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      let { data: response } = await Axios.get(
        "http://localhost:5000/post/getPost"
      );

      let posts = response.posts;
      let mPost: any = [];

      posts.forEach((p: any) => {
        if (p.creator === myUserId) {
          mPost.push(p);
        }
      });

      setMyPosts(mPost);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
    getPosts();
  }, []);

  useEffect(() => {
    console.log("test 1");
  }, []);

  if (!loading) {
    return (
      <>
        <Header />
        <h1>Welcome {myInfo.fName}</h1>
        <div className="container myPosts">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>My posts</Accordion.Header>
              {myPosts.map((e: any) => {
                return (
                  <Accordion.Body
                    onClick={() => {
                      console.log(e._id);
                    }}
                  >
                    <p>{e.title}</p>
                    <p>{e.content}</p>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondry">...</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          variant="danger"
                          onClick={() => {
                            deletePost(e._id);
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
                  </Accordion.Body>
                );
              })}
            </Accordion.Item>
          </Accordion>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );
  }
};

export default MyAccount;
