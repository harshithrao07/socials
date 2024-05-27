import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { signinInput } from "harshithrao07-common-app";
import { Button } from "@material-tailwind/react";

const Signin = () => {
  const [quote, setQuote] = useState("");
  const [signinBody, setSigninBody] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("password");

  useEffect(() => {
    const message = params.get("message");
    setError(message);
  }, []);

  useEffect(() => {
    async function fetchQuote() {
      const options = {
        method: "GET",
        url: "https://api.api-ninjas.com/v1/quotes",
        params: { language: "en" },
        headers: {
          "X-Api-Key": process.env.rapidAPIKey,
        },
      };

      try {
        const response = await axios.request(options);
        const newQuote = response.data[0];
        setQuote(newQuote);
        sessionStorage.setItem("quote", JSON.stringify(newQuote));
      } catch (error) {
        console.error(error);
      }
    }

    const cachedQuote = sessionStorage.getItem("quote");
    if (!cachedQuote) {
      fetchQuote();
    } else {
      setQuote(JSON.parse(cachedQuote));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token_socials");
    if (token) {
      navigate("/blogs");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSigninBody((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validation = signinInput.safeParse(signinBody);

      if (!validation.success) {
        setError(validation.error.issues[0].message);
      }

      if (validation.success) {
        setLoading(true);
        const response = await axios.post(
          "https://backend.backend-harshithrao07.workers.dev/api/v1/user/signin",
          signinBody
        );
        setLoading(false);

        if (response.status === 200) {
          localStorage.setItem("token_socials", response.data.token);
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setShowPassword(!showPassword); 

    if (type === "password") {
      setType("text"); 
    } else {
      setType("password"); 
    }
  };

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">
          Login to your existing account
        </span>
        <span className="text-sm text-gray-500">
          Don't have an account yet?{" "}
          <Link to="/signup" className="underline font-semibold">
            Sign Up
          </Link>
        </span>
        <span className="text-sm text-red-500 mt-1">{error}</span>
        <form onSubmit={handleSubmit} className="flex flex-col mt-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            value={signinBody.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <div className="mb-4 flex">
            <input
              type={type}
              placeholder="Enter your password"
              name="password"
              value={signinBody.password}
              onChange={handleChange}
            />
            <span
              className="flex justify-around items-center cursor-pointer ml-2"
              onClick={handleToggle}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
                    clipRule="evenodd"
                  />
                  <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path
                    fillRule="evenodd"
                    d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </div>
          <button>
            <Button className="mt-5 w-full" variant="filled" loading={loading}>
              Sign in
            </Button>
          </button>
        </form>
      </div>
      <div className="bg-gray-300 h-full flex flex-col justify-center items-center text-center p-5">
        {quote && (
          <>
            <span className="font-bold text-lg">"{quote.quote}"</span>
            <span className="text-md text-gray-600 mt-1">-{quote.author}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Signin;
