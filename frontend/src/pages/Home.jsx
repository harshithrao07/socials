import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@material-tailwind/react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("http://127.0.0.1:8787/api/v1/posts/");
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPosts();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date);
  }

  return (
    <div>
      <div className=" h-[30rem] font-200 px-12 title-container text-white mx-6 rounded-xl mt-3 grid grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="text-7xl font-semibold">Stay curious.</span>
          <span className="mt-12 text-2xl font-light">
            Discover stories, thinking, and expertise from writers on any topic.
          </span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-50 h-50 top-18"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {posts.length > 0 ? (
        <div className="relative group">
          <div className="grid grid-cols-3 mt-10 gap-10 mx-12 group">
            {posts.slice(0, 3).map((post, index) => (
              <div className="flex flex-col" key={index}>
                <img
                  src={post.imagePreview}
                  alt={post.title}
                  className="w-full rounded-lg h-[250px] object-cover"
                />
                <div className="flex justify-start items-center text-sm font-semibold gap-x-2 text-gray-700 font-200 my-3">
                  <span>{post.author.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-2.5 h-2.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <span className="text-gray-900 font-semibold mb-3 text-md flex items-center opacity-80">
                  {post.title.substring(0, 40)}...&nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div className="flex flex-wrap gap-1.5 my-2 opacity-80 mb-5">
                  {post.tags.map((tag, index) => {
                    return (
                      <Chip
                        variant="outlined"
                        value={tag}
                        key={index}
                        className="rounded-ful px-1.5 border-gray-500 hover:border-black py-1 lowercase capitalize font-normal text-xs hover:text-black font-200"
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex bg-gradient-to-b from-transparent to-white justify-center mt-3 h-5/6 absolute w-full -bottom-20 items-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-20 duration-500 ease-in-out">
            <Link
              to="/blogs?page=1"
              className="h-fit w-fit justify-center items-center flex"
            >
              <Button
                variant="gradient"
                size="lg"
                className="rounded-full w-fit flex items-center hover:scale-110 transform-gpu duration-300 h-fit"
              >
                <span className="font-200">View More</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-16 mx-16 mb-16">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="mt-6 w-96 animate-pulse">
              <CardHeader
                shadow={false}
                floated={false}
                className="relative grid h-56 place-items-center bg-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-12 w-12 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </CardHeader>
              <CardBody>
                <Typography
                  as="div"
                  variant="h1"
                  className="mb-4 h-3 w-56 rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
                <Typography
                  as="div"
                  variant="paragraph"
                  className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
                <Typography
                  as="div"
                  variant="paragraph"
                  className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
                <Typography
                  as="div"
                  variant="paragraph"
                  className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
                <Typography
                  as="div"
                  variant="paragraph"
                  className="mb-2 h-2 w-full rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  disabled
                  tabIndex={-1}
                  className="h-8 w-20 bg-gray-300 shadow-none hover:shadow-none"
                >
                  &nbsp;
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
