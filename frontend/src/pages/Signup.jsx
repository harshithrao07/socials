import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    async function fetchQuote() {
        const response = await axios.get("https://type.fit/api/quotes");
        const randomIndex = Math.floor(Math.random() * 16);
        const randomQuote = response.data[randomIndex];
        setQuote(randomQuote);
        console.log(quote)
      }
      
      fetchQuote();
      
  }, []);

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">Create an account</span>
        <span className="text-xs text-gray-500">
          Already have an account? <Link className="underline">Login</Link>
        </span>
        <form className="flex flex-col mt-3">
          <label htmlFor="name">Username</label>
          <input type="text" placeholder="Enter your name" id="name" />
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter your email" id="email" />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            id="password"
          />
          <button className="mt-3 bg-black text-white py-1 rounded-md text-sm font-light">
            Sign Up
          </button>
        </form>
      </div>
      <div className="bg-gray-300 h-full flex flex-col justify-center items-center">

      </div>
    </div>
  );
};

export default Signup;
