import React, { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import { Link } from "react-router-dom";
import { formatDate, scrollToTop } from "../../helper";

const Feed = () => {
  const { data, isLoading } = useGetCurrentUserQuery();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (data) {
      // Combine all activities into one array
      const userActivities = [
        ...data.savedPosts.map((savedPost) => ({
          type: "savedPost",
          ...savedPost,
          timestamp: new Date(savedPost.savedAt),
        })),
        ...data.followers.map((follow) => ({
          type: "followers",
          ...follow,
          timestamp: new Date(follow.createdAt),
        })),
        ...data.following.map((follow) => ({
          type: "following",
          ...follow,
          timestamp: new Date(follow.createdAt),
        })),
      ];

      // Fetch posts of each user you are following
      const followingPosts = data.following.reduce((acc, follow) => {
        const followCreatedAt = new Date(follow.createdAt);
        return [
          ...acc,
          ...follow.following.posts
            .filter((post) => new Date(post.createdAt) >= followCreatedAt)
            .map((post) => ({
              type: "post",
              ...post,
              timestamp: new Date(post.createdAt),
            })),
        ];
      }, []);

      // Combine all activities and following posts
      const allActivities = [...userActivities, ...followingPosts];

      // Sort activities by timestamp
      const sortedActivities = allActivities.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setActivities(sortedActivities);
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
      {activities.length ? (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="my-8 border border-gray-500 rounded-xl"
          >
            {activity.type === "post" && (
              <Link to={`/blogs/${activity.id}`} className="flex">
                <div className="flex flex-col justify-center font-200 text-sm md:text-lg pl-4">
                  <span className="font-100">@{activity.author.username}</span>
                  <span>
                    <span className="font-semibold font-100">
                      {activity.author.name}
                    </span>{" "}
                    posted{" "}
                    <span className="font-semibold font-100">
                      {activity.title}
                    </span>{" "}
                    on{" "}
                    <span className="font-semibold font-100">
                      {formatDate(activity.createdAt)}
                    </span>
                  </span>
                </div>
                <img
                  className="md:w-2/12 w-1/4 ml-auto rounded-r-xl"
                  alt={activity.title}
                  src={activity.imagePreview}
                />
              </Link>
            )}
            {activity.type === "savedPost" && (
              <Link to={`/blogs/${activity.postId}`}>
                <div className="flex">
                  <div className="flex flex-col justify-center font-200 text-sm md:text-lg pl-4">
                    <span>
                      You saved{" "}
                      <span className="font-semibold font-100">
                        @{activity.post.author.username}'s
                      </span>{" "}
                      post{" "}
                      <span className="font-semibold font-100">
                        {activity.post.title}
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold font-100">
                        {formatDate(activity.savedAt)}
                      </span>
                    </span>
                  </div>
                  <img
                    className="md:w-2/12 w-1/4 ml-auto rounded-r-xl"
                    alt={activity.post.title}
                    src={activity.post.imagePreview}
                  />
                </div>
              </Link>
            )}
            {activity.type === "following" && (
              <Link to={`/profile/${activity.following.id}`}>
                <div className="flex h-24 flex-col justify-center font-200 text-sm md:text-lg pl-4">
                  <span>
                    You started following{" "}
                    <span className="font-semibold font-100">
                      @{activity.following.username}
                    </span>{" "}
                    on{" "}
                    <span className="font-semibold font-100">
                      {formatDate(activity.createdAt)}
                    </span>
                  </span>
                </div>
              </Link>
            )}
            {activity.type === "followers" && (
              <Link to={`/profile/${activity.follower.id}`}>
                <div className="flex h-24 flex-col justify-center font-200 text-sm md:text-lg pl-4">
                  <span>
                    <span className="font-semibold font-100">
                      @{activity.follower.username}
                    </span>{" "}
                    started following You on{" "}
                    <span className="font-semibold font-100">
                      {formatDate(activity.createdAt)}
                    </span>
                  </span>
                </div>
              </Link>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col text-center justify-center h-52 items-center font-200 text-lg md:text-2xl">
          <span>Start following people or saving posts to see them in your feed!</span>
          <span className="text-3xl mt-5">(づ ◕‿◕ )づ</span>
        </div>
      )}
    </div>
  );
};
export default Feed;
