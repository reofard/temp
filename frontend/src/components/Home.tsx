import { Link } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import Posts from "./Posts";

const Home = () => {
  return (
    <div>
      <Header />
      <h1 className="text-center">All Posts</h1>
      <br />
      <section>
        <Posts />
      </section>
    </div>
  );
};

export default Home;
