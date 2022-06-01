import { Link } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import Posts from "./Posts";

const Home = () => {
  return (
    <div>
      <Header />
      <h1>Home</h1>
      <Posts />
    </div>
  );
};

export default Home;
