import { Button, Chip, Spinner } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import { formatDate, getBlog, savePost, scrollToTop } from "../../helper";

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noOfSaves, setNoOfSaves] = useState(0);

  const { data, isError, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (data && post) {
      data.savedPosts.map((blog) => blog.id === post.id && setSaved(true));
    }
  }, [data, post]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getBlog(id);
        setPost(response.data);
        setNoOfSaves(response.data.savedBy.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPost();
  }, []);

  const bookMarkPost = async () => {
    const token = localStorage.getItem("token_socials");

    if (!token) {
      navigate("/signin?message=You have to sign up first!");
    }

    if (data) {
      try {
        setLoading(true);
        const response = await savePost(post.id, data.id);

        if (response.status == 200) {
          setSaved(!saved);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (loading === false) {
      if (saved === true) {
        setNoOfSaves((prev) => prev + 1);
      } else if (saved === false) {
        setNoOfSaves((prev) => prev - 1);
      }
    }
  }, [loading]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      {post ? (
        <div className="my-14 mx-4 lg:mx-20">
          <div className="flex flex-col items-center font-200">
            <div className="flex flex-col items-center md:items-center gap-x-3">
              <span className="text-2xl md:text-4xl font-semibold text-gray-900 text-center">
                {post.title}
              </span>
              <div className="flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-5 h-5 md:w-5 md:h-5 fill-black`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                <span className="text-md font-100 font-semibold">
                  x{noOfSaves}
                </span>
              </div>
            </div>
            <div className="flex justify-start items-center text-sm font-semibold gap-x-2 text-gray-700 font-200 my-5">
              <Link className="underline" to={`/profile/${post.author.id}`}>
                <span>{post.author.name}</span>
              </Link>
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
            <div className="flex justify-center">
              {data && data.name !== post.author.name && (
                <Button
                  className="rounded-full mb-6 flex items-center gap-x-1 hover:text-black hover:border-black scale-90"
                  variant="outlined"
                  onClick={bookMarkPost}
                >
                  {saved ? (
                    loading ? (
                      <>
                        <Spinner className="h-5 w-5" />
                        <span className="text-lg ml-2">Unsaving...</span>
                      </>
                    ) : (
                      <>
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
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <span className="text-lg">Saved</span>
                      </>
                    )
                  ) : loading ? (
                    <>
                      <Spinner className="h-5 w-5" />
                      <span className="text-lg ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-6 mb-12">
              {post.tags.map((tag, index) => (
                <Chip
                  variant="outlined"
                  value={tag}
                  key={index}
                  className="rounded-full lowercase capitalize font-normal text-sm text-black"
                />
              ))}
            </div>
            <img
              src={post.imagePreview}
              alt={post.title}
              className="rounded-lg w-full md:w-3/4"
            />
          </div>
          <div
            className="ql-editor my-5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
