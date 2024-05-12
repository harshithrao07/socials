import { Button, Chip, Spinner } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(
          `http://localhost:8787/api/v1/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPost();
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
    <>
      {post ? (
        <div className="my-14 mx-20">
          <div className="flex flex-col items-center font-200">
            <div className="flex items-center gap-x-3">
              <span className="text-4xl font-semibold text-gray-900 text-center">
                {post.title}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9 cursor-pointer hover:fill-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </div>
            <div className="flex justify-start items-center text-sm font-semibold gap-x-2 text-gray-700 font-200 my-5">
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
            <div className="flex flex-wrap gap-6 mb-12">
              {post.tags.map((tag, index) => {
                return (
                  <Chip
                    variant="outlined"
                    value={tag}
                    key={index}
                    className="rounded-full lowercase capitalize font-normal text-sm text-black"
                  />
                );
              })}
            </div>
            <img
              src={post.imagePreview}
              alt={post.title}
              className="rounded-lg w-3/4"
            />
          </div>
          <div className="ql-editor my-5" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="flex justify-center">
            <Button className="rounded-full flex items-center gap-x-1" variant="outlined">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
              <span className="text-lg">Save this article</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-screen justify-center items-center">
          <Spinner className="h-12 w-12" />
        </div>
      )}
    </>
  );
};

export default BlogDetails;
