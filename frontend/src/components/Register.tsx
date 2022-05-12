import React, { SyntheticEvent, useState } from "react";

import axios from "axios";

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

  const printState = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      let registration = await axios.post(
        "http://localhost:5000/test/register",
        user
      );
      let data = registration.data;
      console.log(data);

      if (data) {
        console.log("Account created successfully");
        document.cookie = `user=${data.token}`;
      }

      setUser({
        ...user,
        fname: "",
        lname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="App">
      <form onSubmit={printState}>
        fname
        <input
          type="text"
          value={user.fname}
          onChange={(e) => setUser({ ...user, fname: e.target.value })}
        />
        <br />
        lname{" "}
        <input
          type="text"
          value={user.lname}
          onChange={(e) => setUser({ ...user, lname: e.target.value })}
        />{" "}
        <br />
        email{" "}
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />{" "}
        <br />
        password{" "}
        <input
          type="text"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />{" "}
        <br />
        <button type="submit">Sumbit</button>
      </form>
    </div>
  );
};

export default Register;
