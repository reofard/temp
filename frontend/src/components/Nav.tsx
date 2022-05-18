import { Link, useNavigate } from "react-router-dom";

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

  //gets user cookie by name
  function getCookie(cookieName: any) {
    let cookie: any = {};
    document.cookie.split(";").forEach(function (el) {
      let [key, value] = el.split("=");
      cookie[key.trim()] = value;
    });
    return cookie[cookieName];
  }

  const logout = () => {
    document.cookie = `user=`;
    console.log(document.cookie);
    navigate("/");
  };

  if (!getCookie("user")) {
    return (
      <>
        <Link to="/register">Register</Link>

        <br />
        <Link to="/login"> Login</Link>
      </>
    );
  } else {
    return (
      <>
        <button className="btn btn-danger" onClick={logout}>
          Log out
        </button>
        ;
      </>
    );
  }
};

export default Nav;
