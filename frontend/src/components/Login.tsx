import { SyntheticEvent, useState } from "react";
import { Form } from "react-bootstrap";
import Header from "./Header";

import axios from "axios";

import "../style/login.css";

import { useNavigate } from "react-router-dom";

const Login = () => {
  interface IuserLogin {
    email: string;
    password: string;
  }

  const [status, setStatus] = useState<String>("");

  const [userLogin, setUserLogin] = useState<IuserLogin>({
    email: "",
    password: "",
  });

  // for redirecting
  const navigate = useNavigate();

  //Checks for empty fields
  const checkForEmpty = () => {
    if (userLogin.email === "" || userLogin.password === "") {
      setStatus("Please fill in all fields");
      throw new Error("Enter all fields");
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      let user = await axios.post(
        "http://localhost:5000/user/login",
        userLogin
      );

      if (user) {
        console.log("Login successfully");
        console.log(user.data);

        //gets jwt token
        document.cookie = `user=${user.data.token}`;

        //creating cookie for userId for filtering purposes
        document.cookie = `userId=${user.data._id}`;
      }

      console.log(user.data.token);
      console.log(user.data);
      navigate("/");
    } catch (error) {
      console.log(error);
      checkForEmpty();
      setStatus("Invalid email or password");
    }
  };
  return (
    <div>
      <Header />

      <h2>Login</h2>
      <p>{status}</p>

      <div className="form">
        <Form onSubmit={handleSubmit}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={userLogin.email}
            onChange={(e: any) =>
              setUserLogin({ ...userLogin, email: e.target.value })
            }
          />
          <br />
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={userLogin.password}
            onChange={(e: any) =>
              setUserLogin({ ...userLogin, password: e.target.value })
            }
          />
          <button className="btn btn-success">Login</button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
