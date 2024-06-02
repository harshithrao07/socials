import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Blogs from "../../components/Blogs";

const AllBlogs = () => {
  const POSTS_PER_PAGE = 9; // Number of posts per page
  const [posts, setPosts] = useState([]);
  const [params, setParams] = useSearchParams();
  const [totalPosts, setTotalPosts] = useState(9);
  const page = parseInt(params.get("page"), 10);

  const [active, setActive] = useState(page);
  const [loading, setLoading] = useState(false);

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
          `http://127.0.0.1:8787/api/v1/posts?page=${active}`
        );
        setPosts(response.data);
        // Extract total count from response headers

        const totalCount = response.headers["x-total-count"]; // Case-insensitive access
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

  // Generate pagination buttons dynamically based on total number of pages
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <IconButton key={i} {...getItemProps(i)}>
        {i}
      </IconButton>
    );
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <Blogs posts={posts} isLoading={loading} />
      <div className="flex items-center gap-4 justify-center my-4">
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
          disabled={active === totalPages}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AllBlogs;
