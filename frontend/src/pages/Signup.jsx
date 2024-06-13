import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInput } from "harshithrao07-common-app";
import { Button } from "@material-tailwind/react";
import Input from "../components/Input";
import Quote from "../components/Quote";
import { scrollToTop, signUpUser } from "../helper";

const Signup = () => {
  const [signupBody, setSignupBody] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("password");

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token_socials");
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
        const response = await signUpUser(signupBody);
        setLoading(false);

        if (response.status === 200) {
          localStorage.setItem("token_socials", response.data.token);
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError(error.response.data.message);
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
    <div className="grid md:grid-cols-2 h-screen text-center md:text-left">
      <div className="flex flex-col items-center justify-center p-5">
        <span className="text-3xl font-bold">Create an account</span>
        <span className="text-md text-gray-500">
          Already have an account?{" "}
          <Link to="/signin" className="underline font-semibold">
            Login
          </Link>
        </span>
        <span className="text-md text-red-500 mt-1">{error}</span>
        <form className="flex flex-col mt-1">
          <Input
            htmlFor="name"
            type="text"
            placeholder="Enter your name"
            name="name"
            value={signupBody.name}
            onChange={handleChange}
          />
          <Input
            htmlFor="username"
            type="text"
            placeholder="Enter your username"
            name="username"
            value={signupBody.username}
            onChange={handleChange}
          />
          <Input
            htmlFor="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={signupBody.email}
            onChange={handleChange}
          />
          <Input
            htmlFor="password"
            type={type}
            placeholder="Enter your password"
            name="password"
            value={signupBody.password}
            onChange={handleChange}
            handleToggle={handleToggle}
            showPassword={showPassword}
          />
          <button>
            <Button
              onClick={handleSubmit}
              className="mt-5 w-full"
              variant="filled"
              loading={loading}
            >
              Sign in
            </Button>
          </button>
        </form>
      </div>
      <Quote />
    </div>
  );
};

export default Signup;
