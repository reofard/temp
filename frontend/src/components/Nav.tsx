import { Link, useNavigate } from "react-router-dom";

import { getCookie } from "../cookies";

const Nav = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <br />
        <LoginCheck />
      </nav>
    </>
  );
};

const LoginCheck = () => {
  const navigate = useNavigate();

  const logout = () => {
    document.cookie = `user=`;
    navigate("/");
  };

  //getCookie from export cookies file
  if (!getCookie("user")) {
    return (
      <>
        <Link to="/register">Register</Link>

        <Link to="/login"> Login</Link>
      </>
    );
  } else {
    return (
      <>
        <br />
        <br />
        <button className="btn btn-danger" onClick={logout}>
          Log out
        </button>
      </>
    );
  }
};

export default Nav;
