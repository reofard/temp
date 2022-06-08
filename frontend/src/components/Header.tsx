import { Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { getCookie } from "../cookies";

const Header = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Nav className="me-auto">
            <Link to="/">Home</Link>
            <LoginCheck />
          </Nav>
        </Container>
      </Navbar>
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
      <Navbar bg="light" expand="lg">
        <Nav className="me-auto">
          <Link to="/register">Register</Link>
          <Link to="/login"> Login</Link>
        </Nav>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Nav className="me-auto">
            <button className="btn btn-danger" onClick={logout}>
              Log out
            </button>
            <Link to="/account"> My Account</Link>
          </Nav>
        </Container>
      </Navbar>
    );
  }
};

export default Header;
