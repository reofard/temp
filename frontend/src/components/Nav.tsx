import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <br />
        <Link to="/register">Register</Link>
      </nav>
    </>
  );
};

export default Nav;
