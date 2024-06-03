import React, { useEffect } from "react";
import Blogs from "../components/Blogs";
import { useGetAllPostsQuery } from "../app/service/socials";
import { scrollToTop } from "../helper";

const Home = () => {
  const { data, isError, isLoading } = useGetAllPostsQuery();

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div>
      <div className="h-[20rem] overflow-hidden md:h-[30rem] font-200 px-6 md:px-12 title-container text-white mx-4 md:mx-6 rounded-xl mt-3 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center p-3 text-center md:text-left">
          <span className="text-3xl md:text-7xl font-semibold">
            Stay curious.
          </span>
          <span className="mt-2 md:mt-7 text-md md:text-2xl font-light">
            Discover stories, thinking, and expertise from writers on any topic.
          </span>
        </div>
        <div className="justify-center items-center mt-6 md:mt-0 hidden md:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-11/12"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="my-16">
        <div className="hidden md:flex justify-center">
          <span className="text-xl md:text-4xl w-fit font-300 font-bold text-center">
            Designed for the future
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden my-7 md:mt-0 md:mb-7">
          <div className="flex justify-center flex-col px-4 md:pl-20 leading-6">
            <span className="text-2xl font-300 font-semibold text-center md:text-left">
              Introducing an extensible editor
            </span>
            <span className="font-200 text-gray-600 mb-16 mt-2 text-center md:text-left">
              Blogr features an exceedingly intuitive interface which lets you
              focus on one thing: creating content. The editor supports
              management of multiple blogs and allows easy manipulation of
              embeds such as images.
            </span>

            <span className="text-2xl font-300 font-semibold text-center md:text-left">
              Robust content management
            </span>
            <span className="font-200 text-gray-600 mt-2 text-center md:text-left">
              Flexible content management enables users to easily move through
              posts. Increase the usability of your blog by adding customized
              categories, sections, format, or flow. With this functionality,
              you’re in full control.
            </span>
          </div>
          <div className="flex justify-center md:justify-end relative md:left-24 mt-5 md:mt-0">
            <img
              className="w-11/12"
              alt="some image"
              src="illustration-editor-desktop.svg"
            />
          </div>
        </div>

        <div className="title-container text-white md:rounded-ss-full md:rounded-ee-full p-10 md:p-20 flex flex-col text-center items-center my-16">
          <span className="text-4xl w-fit font-300 font-semibold text-center">
            State of the Art Infrastructure
          </span>
          <span className="font-200 mt-5 text-center mx-4 md:mx-24">
            With reliability and speed in mind, worldwide data centers provide
            the backbone for ultra-fast connectivity. This ensures your site
            will load instantly, no matter where your readers are, keeping your
            site competitive.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden my-10">
          <div className="flex justify-center flex-col px-4 md:pl-20 leading-6">
            <span className="text-2xl font-300 font-semibold text-center md:text-left">
              Free, open, simple
            </span>
            <span className="font-200 text-gray-600 mb-16 mt-2 text-center md:text-left">
              Blogr is a free application. It supports features such as code
              syntax highlighting, RSS feeds, social media integration,
              third-party commenting tools, and works seamlessly with Google
              Analytics. The architecture is clean and is relatively easy to
              learn.
            </span>

            <span className="text-2xl font-300 font-semibold text-center md:text-left">
              Powerful tooling
            </span>
            <span className="font-200 text-gray-600 mt-2 text-center md:text-left">
              Batteries included. We built a simple and straightforward CLI tool
              that makes customization and deployment a breeze, but capable of
              producing even the most complicated sites.
            </span>
          </div>
          <div className="flex justify-center md:justify-end relative md:left-24 mt-5 md:mt-0">
            <img
              className="w-11/12"
              alt="some image"
              src="illustration-laptop-desktop.svg"
            />
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:flex-col">
        <div className="flex justify-center">
          <span className="text-2xl md:text-4xl w-fit font-300 font-bold text-center my-2">
            Check out the blogs
          </span>
        </div>
        <div className="mb-4">
          <Blogs posts={data?.slice(0, 3)} isLoading={isLoading} from="Home" />
        </div>
      </div>
    </div>
  );
};

export default Home;
