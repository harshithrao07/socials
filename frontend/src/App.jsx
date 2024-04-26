import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Blog from "./pages/blogs/Blog";
import Home from "./pages/Home";
import BlogDetails from "./pages/blogs/BlogDetails";
import Layout from "./pages/Layout";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route path="blogs" element={<Layout />}>
              <Route index element={<Blog />} />
              <Route path=":id" element={<BlogDetails />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
