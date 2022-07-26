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
            <Nav.Link href="/">Home</Nav.Link>
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
    document.cookie = `userId=`;

    navigate("/");
  };

  //getCookie from export cookies file
  if (!getCookie("user")) {
    return (
      <>
        <Nav.Link href="/register">Register</Nav.Link>
        <Nav.Link href="/login"> Login</Nav.Link>
      </>
    );
  } else {
    return (
      <>
        <Nav.Link href="/account"> My Account</Nav.Link>

        <Nav.Link href="/" onClick={logout}>
          Log out
        </Nav.Link>
      </>
    );
  }
};

export default Header;
