import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useEffect } from "react";
import Posts from "./Posts";

const Home = () => {
  return (
    <div>
      <Nav />
      <h1>Home</h1>
      <Posts />
    </div>
  );
};

export default Home;
