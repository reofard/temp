import Register from "./components/Register";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
