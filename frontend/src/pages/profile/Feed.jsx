import React, { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import { Link } from "react-router-dom";
import { formatDate, scrollToTop } from "../../helper";

const Feed = () => {
  const { data, isLoading } = useGetCurrentUserQuery();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data && data.following) {
      const allPosts = data.following.flatMap((user) => user.posts);

      const sortedPosts = allPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosts(sortedPosts);
    }
  }, [data]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="mx-8 my-4">
      <div className="text-center">
        <span className="font-300 font-semibold text-xl md:text-3xl border-b-2 border-black">
          Your Feed:
        </span>
      </div>
      {posts.length ? (
        posts.map((post) => (
          <Link
            key={post.id}
            to={`/blogs/${post.id}`}
            className="flex my-8 border border-gray-500 md:pl-5 rounded-xl hover:bg-gray-100"
          >
            <div className="flex flex-col justify-center font-200 text-sm md:text-lg p-3 md:p-0">
              <span className="font-100">@{post.author.username}</span>
              <span>
                <span className="font-semibold font-100">
                  {post.author.name}
                </span>{" "}
                posted{" "}
                <span className="font-semibold font-100">{post.title}</span> on{" "}
                <span className="font-semibold font-100">
                  {formatDate(post.createdAt)}
                </span>
              </span>
            </div>
            <img
              className="md:w-2/12 w-1/4 ml-auto rounded-r-xl"
              alt={post.title}
              src={post.imagePreview}
            />
          </Link>
        ))
      ) : (
        <div className="flex flex-col text-center justify-center h-52 items-center font-200 text-lg md:text-2xl">
          <span>You currently are not following anyone!</span>
          <span className="text-3xl mt-5">(づ ◕‿◕ )づ</span>
        </div>
      )}
    </div>
  );
};

export default Feed;
