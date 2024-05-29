import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Blogs from "../../components/Blogs";
import { useGetProfileQuery } from "../../app/service/socials";

const ProfileBlogs = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProfileQuery(id);

  return (
    <div className="my-5">
      <span className="font-100 text-3xl pb-0.5 border-b border-black mx-10">
        Posts:
      </span>
      <div>
        <Blogs posts={data?.posts} isLoading={isLoading} />
        {data?.posts.length === 0 && (
          <div className="flex justify-center h-52 items-center font-200 text-2xl">
            <span>You currently have not written any blogs yet!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBlogs;
