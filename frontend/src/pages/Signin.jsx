import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signinInput } from "harshithrao07-common-app";
import { Button } from "@material-tailwind/react";
import { scrollToTop, signInUser } from "../helper";
import Input from "../components/Input";
import Quote from "../components/Quote";

const Signin = () => {
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
    scrollToTop();
  }, []);

  useEffect(() => {
    const message = params.get("message");
    setError(message);
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
        const response = await signInUser(signinBody);
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
    <div className="grid md:grid-cols-2 min-h-screen text-center md:text-left">
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
          <Input
            htmlFor="username"
            type="text"
            placeholder="Enter your username"
            name="username"
            value={signinBody.username}
            onChange={handleChange}
          />
          <Input
            htmlFor="password"
            type={type}
            placeholder="Enter your password"
            name="password"
            value={signinBody.password}
            onChange={handleChange}
            handleToggle={handleToggle}
            showPassword={showPassword}
          />
          <button>
            <Button className="mt-5 w-full" variant="filled" loading={loading}>
              Sign in
            </Button>
          </button>
        </form>
      </div>
      <Quote />
    </div>
  );
};

export default Signin;
