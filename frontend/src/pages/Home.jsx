import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if(token) {
        navigate("/blogs")
    }

    if (!token) {
      navigate("/signup");
    }
  }, []);

  return <div></div>;
};

export default Home;
