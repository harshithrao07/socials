import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import BlogDetails from "./pages/blogs/BlogDetails";
import Layout from "./pages/Layout";
import Compose from "./pages/blogs/Compose";
import AllBlogs from "./pages/blogs/AllBlogs";
import ProfileHeader from "./components/ProfileHeader";
import ProfileBlogs from "./pages/profile/ProfileBlogs";
import RouteError from "./RouteError";
import SavedBlogs from "./pages/profile/SavedBlogs";
import Feed from "./pages/profile/Feed";
import EditBlog from "./pages/blogs/EditBlog";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<AllBlogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/blogs/compose" element={<Compose />} />
            <Route path="/profile/:id" element={<ProfileHeader />}>
              <Route index element={<ProfileBlogs />} />
              <Route path="saved" element={<SavedBlogs />} />
              <Route path="feed" element={<Feed />} />
            </Route>
            <Route path="*" element={<RouteError />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
