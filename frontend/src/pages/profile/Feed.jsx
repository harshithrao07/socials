import React, { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import { Link } from "react-router-dom";
import { formatDate, scrollToTop } from "../../helper";

const Feed = () => {
  const { data, isLoading } = useGetCurrentUserQuery();
  const [activities, setActivities] = useState([]);
  console.log(data)
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
        // ...data.following.following.map((user) => user.posts.map((post) => ({
        //   type: "post",
        //   ...post,
        //   timestamp: new Date(post.createdAt),
        // }))),
      ];
      console.log(userActivities)
      // Sort activities by timestamp
      const sortedActivities = userActivities.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setActivities(sortedActivities);
    }
  }, [data]);

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    console.log(activities)
  }, [activities])

 return (
    <div className="mx-8 my-4">
      <div className="text-center">
        <span className="font-300 font-semibold text-xl md:text-3xl border-b-2 border-black">
          Your Feed:
        </span>
      </div>
      {activities.length ? (
        activities.map((activity) => (
          <div key={activity.id} className="my-8 border border-gray-500 p-4 rounded-xl">
            {activity.type === "post" && (
              <Link to={`/blogs/${activity.id}`} className="flex hover:bg-gray-100">
                <div className="flex flex-col justify-center font-200 text-sm md:text-lg">
                  <span className="font-100">@{activity.author.username}</span>
                  <span>
                    <span className="font-semibold font-100">
                      {activity.author.name}
                    </span>{" "}
                    posted{" "}
                    <span className="font-semibold font-100">{activity.title}</span> on{" "}
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
              <div className="flex">
                <div className="flex flex-col justify-center font-200 text-sm md:text-lg">
                  <span className="font-100">@{activity.post.author.username}</span>
                  <span>
                    <span className="font-semibold font-100">
                      {activity.post.author.name}
                    </span>{" "}
                    saved{" "}
                    <span className="font-semibold font-100">{activity.post.title}</span> on{" "}
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
            )}
            {activity.type === "follow" && (
              <div className="flex flex-col justify-center font-200 text-sm md:text-lg">
                <span className="font-100">@{data.username}</span>
                <span>
                  <span className="font-semibold font-100">
                    {data.name}
                  </span>{" "}
                  followed{" "}
                  <span className="font-semibold font-100">@{activity.following.username}</span> on{" "}
                  <span className="font-semibold font-100">
                    {formatDate(activity.createdAt)}
                  </span>
                </span>
              </div>
            )}
          </div>
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
