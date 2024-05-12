import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import BlogDetails from "./pages/blogs/BlogDetails";
import Layout from "./pages/Layout";
import Compose from "./pages/blogs/Compose";
import Blogs from "./pages/blogs/Blogs";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/blogs/compose" element={<Compose />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
