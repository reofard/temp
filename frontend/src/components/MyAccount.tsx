import Axios from "axios";
import Header from "./Header";
import { getCookie } from "../cookies";
import { useEffect, useState } from "react";

const MyAccount = () => {
  const [myInfo, setMyinfo] = useState<object>({});
  const myToken = getCookie("user");

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

      console.log(myInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (myToken) {
      getInfo();
    }

    console.log(myInfo);
  }, []);

  return (
    <>
      <Header />
      <h1>hello </h1>
      <h2>Test</h2>
    </>
  );
};

export default MyAccount;
