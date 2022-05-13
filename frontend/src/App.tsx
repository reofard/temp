import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import Register from "./components/Register";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
