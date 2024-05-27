import React from "react";
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
import { formatDate } from "../helper";

const Blogs = ({ posts, isLoading, from }) => {

  return (
    <div>
      {posts && posts.length > 0 && isLoading === false ? (
        <div className="grid grid-cols-3 mt-10 gap-10 mx-12 relative group/main">
          {posts.map((post, index) => (
            <Link to={`/blogs/${post.id}`} key={index}>
              <div
                className={`flex flex-col ${from !== "Home" && "group/img"}`}
              >
                <img
                  src={post.imagePreview}
                  alt={post.title}
                  className="w-full rounded-lg h-[250px] object-cover group-hover/img:scale-105 duration-300 transform-gpu"
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
          {from === "Home" && (
            <div className="flex bg-gradient-to-b from-transparent to-white justify-center mt-3 h-5/6 absolute w-full -bottom-20 items-center opacity-0 group-hover/main:opacity-100 group-hover/main:-translate-y-20 duration-500 ease-in-out">
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
          )}
        </div>
      ) : (
        isLoading === true &&
        <div className="grid grid-cols-3 mx-16 gap-5 mb-16">
          {[...Array(from === "Home" ? 3 : 9)].map((_, index) => (
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

export default Blogs;
