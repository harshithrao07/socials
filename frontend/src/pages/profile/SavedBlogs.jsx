import React, { useEffect } from "react";
import { useGetCurrentUserQuery } from "../../app/service/socials";
import Blogs from "../../components/Blogs";

const SavedBlogs = () => {
  const { data, isError, isLoading, refetch } = useGetCurrentUserQuery();

  useEffect(() => {
    refetch();
  }, [])

  return (
    <div className="my-5">
      <span className="font-300 text-3xl pb-0.5 border-b-2 border-black mx-10">
        Saved Posts:
      </span>
      <div>
          <Blogs posts={data?.savedPosts} isLoading={isLoading} />
          {
            data?.savedPosts.length === 0 && (
              <div className="flex justify-center h-52 items-center font-200 text-2xl">
                <span>You currently have not saved any blogs yet!</span>
              </div>
            )
          }
        
      </div>
    </div>
  );
};

export default SavedBlogs;
