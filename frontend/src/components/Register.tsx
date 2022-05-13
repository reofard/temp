import React, { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Nav from "./Nav";

import { Form } from "react-bootstrap";

const Register = () => {
  interface Iuser {
    fname: string;
    lname: string;
    email: string;
    password: string;
  }

  const [user, setUser] = useState<Iuser>({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();

  const emptyFields = () => {
    if (
      user.fname === "" ||
      user.lname === "" ||
      user.email === "" ||
      user.password === ""
    ) {
      setStatus("Please fill in all fields");
      console.log("empty field");

      throw new Error("Enter all fields");
    }
  };

  const printState = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      let registration = await axios.post(
        "http://localhost:5000/test/register",
        user
      );
      let data = registration.data;

      //sets a cookie with user bearer token if runs if account creating is successful
      if (data) {
        console.log("Account created successfully");
        document.cookie = `user=${data.token}`;
      }

      //empties the user state
      setUser({
        ...user,
        fname: "",
        lname: "",
        email: "",
        password: "",
      });

      setStatus("");

      // navigates you back to hmoe page
      navigate("/");
    } catch (error) {
      setStatus("User with that email already exists");
      //error logic if there is an empty field
      emptyFields();

      setUser({
        ...user,
        fname: "",
        lname: "",
        email: "",
        password: "",
      });
    }
  };
  return (
    <div className="App">
      <Nav />

      <h2>Registration</h2>
      <p className="text-danger">{status}</p>
      <div className="form">
        <Form onSubmit={printState}>
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            value={user.fname}
            onChange={(e: any) => setUser({ ...user, fname: e.target.value })}
            placeholder="First name"
          />
          <br />
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            value={user.lname}
            onChange={(e: any) => setUser({ ...user, lname: e.target.value })}
            placeholder="Last name"
          />{" "}
          <br />
          <Form.Label> Email</Form.Label>
          <Form.Control
            type="text"
            value={user.email}
            onChange={(e: any) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />{" "}
          <br />
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            value={user.password}
            onChange={(e: any) =>
              setUser({ ...user, password: e.target.value })
            }
            placeholder="Password"
          />{" "}
          <br />
          <button type="submit">Sumbit</button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
