import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
const Blogs = () => {
  const POSTS_PER_PAGE = 9; // Number of posts per page
  const [posts, setPosts] = useState([]);
  const [params, setParams] = useSearchParams();
  const [totalPosts, setTotalPosts] = useState(9);
  const page = parseInt(params.get("page"), 10);

  const [active, setActive] = React.useState(page);
  const [loading, setLoading] = React.useState(false);

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
    className: "rounded-full",
  });

  const next = () => {
    const nextPage = parseInt(active, 10) + 1;
    if (nextPage > 5) return;

    setActive(nextPage);
    setParams({ page: nextPage });
  };

  const prev = () => {
    const prevPage = parseInt(active, 10) - 1;
    if (prevPage < 1) return;

    setActive(prevPage);
    setParams({ page: prevPage });
  };

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8787/api/v1/posts/?page=${active}`
        );
        setPosts(response.data);
        // Extract total count from response headers
        console.log(response);
        const totalCount = response.headers["x-total-count"]; // Case-insensitive access
        console.log("Total Posts:", totalCount);
        setTotalPosts(totalCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [active, params]);

  // Calculate total number of pages based on total number of posts and posts per page
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  console.log(totalPages);
  // Generate pagination buttons dynamically based on total number of pages
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <IconButton key={i} {...getItemProps(i)}>
        {i}
      </IconButton>
    );
  }

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
      {posts.length > 0 && loading === false ? (
        <div className="grid grid-cols-3 mt-10 gap-10 mx-12">
          {posts.map((post, index) => (
            <Link to={`/blogs/${post.id}`} key={index}>
              <div className="flex flex-col group">
                <img
                  src={post.imagePreview}
                  alt={post.title}
                  className="w-full rounded-lg h-[250px] object-cover group-hover:scale-105 duration-300 transform-gpu"
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
                <span className="text-gray-900 font-semibold mb-2 text-md flex items-center opacity-80">
                  {post.title}
                </span>
                <div className="flex flex-wrap gap-1.5 opacity-80 mb-5">
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-16 mx-16 mb-16">
          {[...Array(9)].map((_, index) => (
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
      <div className="flex items-center gap-4 justify-center mb-8">
        <Button
          variant="text"
          className="flex items-center gap-2 rounded-full"
          onClick={prev}
          disabled={active === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">{paginationButtons}</div>
        <Button
          variant="text"
          className="flex items-center gap-2 rounded-full"
          onClick={next}
          disabled={active === 5}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Blogs;
