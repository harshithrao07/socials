import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Blogs from "../../components/Blogs";
import { useGetProfileQuery } from "../../app/service/socials";
import { scrollToTop } from "../../helper";

const ProfileBlogs = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProfileQuery(id);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="my-5">
      <div className="text-center">
        <span className="font-300 font-semibold text-xl md:text-3xl border-b-2 border-black">
          Posts:
        </span>
      </div>
      <div>
        <Blogs posts={data?.posts} isLoading={isLoading} />
        {data?.posts.length === 0 && (
          <div className="flex flex-col text-center justify-center h-52 items-center font-200 text-lg md:text-2xl">
            <span>You currently have not written any blogs yet!</span>
            <span className="text-3xl mt-5">(⌐■_■)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBlogs;
