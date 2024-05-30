import React, { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import { Link } from "react-router-dom";
import { formatDate } from "../../helper";

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
    console.log(posts);
  }, [posts]);

  return (
    <div className="mx-8 my-4">
      <span className="font-300 text-3xl pb-0.5 border-b-2 border-black">
        Your Feed:
      </span>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/blogs/${post.id}`}
          className="flex my-8 border border-gray-500 pl-5 rounded-xl hover:bg-gray-100"
        >
          <div className="flex flex-col justify-center font-200 text-lg">
            <span className="font-100">@{post.author.username}</span>
            <span>
              <span className="font-semibold font-100">{post.author.name}</span>{" "}
              posted{" "}
              <span className="font-semibold font-100">{post.title}</span> on{" "}
              <span className="font-semibold font-100">
                {formatDate(post.createdAt)}
              </span>
            </span>
          </div>
          <img
            className="w-2/12 ml-auto rounded-r-xl"
            alt={post.title}
            src={post.imagePreview}
          />
        </Link>
      ))}
    </div>
  );
};

export default Feed;
