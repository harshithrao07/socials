import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signupInput } from "harshithrao07-common-app";

const Signup = () => {
  const [quote, setQuote] = useState("");
  const [signupBody, setSignupBody] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      const options = {
        method: "GET",
        url: "https://api.api-ninjas.com/v1/quotes",
        params: { language: "en" },
        headers: {
          "X-Api-Key": "brB1AhSxeJT2Vw6Tb2u0aQ==weOxBVOnJ9ukucUR",
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
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupBody((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validation = signupInput.safeParse(signupBody);

      if (!validation.success) {
        setError(validation.error.issues[0].message);
      }

      if (validation.success) {
        setLoading(true);
        const response = await axios.post(
          "https://backend.backend-harshithrao07.workers.dev/api/v1/user/signup",
          signupBody
        );
        setLoading(false);

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          navigate("/blogs");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">Create an account</span>
        <span className="text-xs text-gray-500">
          Already have an account?{" "}
          <Link to="/signin" className="underline font-semibold">
            Login
          </Link>
        </span>
        <span className="text-xs text-red-500 mt-1">{error}</span>
        <form onSubmit={handleSubmit} className="flex flex-col mt-1">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={signupBody.name}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={signupBody.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={signupBody.password}
            onChange={handleChange}
          />
          <Button className="mt-5" size="sm" variant="filled" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
      <div className="bg-gray-300 h-full flex flex-col justify-center items-center text-center p-5">
        {quote && (
          <>
            <span className="font-bold">"{quote.quote}"</span>
            <span className="text-sm text-gray-500">-{quote.author}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
