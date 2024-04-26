import React from "react";
import { NavBar } from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
