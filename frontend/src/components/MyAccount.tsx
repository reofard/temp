import Axios from "axios";
import Header from "./Header";
import { getCookie } from "../cookies";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import Accordion from "react-bootstrap/Accordion";

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

  // const getMyPosts = async () => {
  //   try {
  //     const { data: posts } = await Axios.post(
  //       "http://localhost:5000/post/myPosts",
  //       { token: myToken }
  //     );

  //     console.log(posts);
  //     console.log(myToken);

  //     setMyPosts(posts);

  //     console.log(myPosts, "h");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getPosts = async () => {
    try {
      const { data: response } = await Axios.get(
        "http://localhost:5000/post/getPost"
      );

      response.posts.map((e: any) => {
        if (e.creator === myUserId) {
          console.log(e);
        }
      });

      setMyPosts(response.posts);
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

  if (!loading && myPosts.length > 1) {
    return (
      <>
        <Header />
        <h1>Welcome {myInfo.fName}</h1>
        <p>{myToken}</p>
        <div className="container myPosts">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>My posts</Accordion.Header>
              {myPosts.map((e: any) => {
                return (
                  <Accordion.Body>
                    <p>{e.title}</p>
                    <p>{e.content}</p>
                    <p>{e.creator}</p>
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
