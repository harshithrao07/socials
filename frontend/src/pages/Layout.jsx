import React from "react";
import { NavBar } from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { FooterWithSitemap } from "../components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <FooterWithSitemap />
    </div>
  );
};

export default Layout;
