import React, { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import Blogs from "../../components/Blogs";
import { scrollToTop } from "../../helper";

const SavedBlogs = () => {
  const { data, isError, isLoading, refetch } = useGetCurrentUserQuery();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (data) {
      const savedPosts = data.savedPosts.map((savedPost) => savedPost.post);
      setPosts(savedPosts);
    }
  }, [data]);

  return (
    <div className="my-5">
      <div className="text-center">
        <span className="font-300 font-semibold text-xl md:text-3xl border-b-2 border-black mx-10">
          Saved Posts:
        </span>
      </div>
      <div>
        <Blogs posts={posts} isLoading={isLoading} />
        {data?.savedPosts.length === 0 && (
          <div className="flex flex-col text-center justify-center h-52 items-center font-200 text-lg md:text-2xl">
            <span>You currently have not saved any blogs yet!</span>
            <span className="text-3xl mt-5">(●´⌓`●)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBlogs;
