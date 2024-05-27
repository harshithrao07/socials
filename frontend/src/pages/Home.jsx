import React from "react";
import Blogs from "../components/Blogs";
import { useGetAllPostsQuery } from "../app/service/socials";

const Home = () => {
  const { data, isError, isLoading } = useGetAllPostsQuery();

  return (
    <div>
      <div className=" h-[30rem] font-200 px-12 title-container text-white mx-6 rounded-xl mt-3 grid grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="text-7xl font-semibold">Stay curious.</span>
          <span className="mt-12 text-2xl font-light">
            Discover stories, thinking, and expertise from writers on any topic.
          </span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-50 h-50 top-18"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <Blogs posts={data?.slice(0, 3)} isLoading={isLoading} from="Home" />
    </div>
  );
};

export default Home;
