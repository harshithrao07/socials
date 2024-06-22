import React from "react";
import { Navbar, Collapse, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useGetCurrentUserQuery } from "../app/service/socials";
import ProfileNav from "./ProfileNav";

function NavList({ data, isLoading, handleClick }) {
  return (
    <ul className="my-2 flex justify-center flex-col gap-2 md:mb-0 md:mt-0 md:flex-row items-center md:gap-7 font-200">
      <Link to="/" className="text-gray-600 hover:text-black text-xl" onClick={handleClick}>
        <span>Home</span>
      </Link>
      <Link
        to="/blogs?page=1"
        className="text-gray-600 hover:text-black text-xl"
        onClick={handleClick}
      >
        <span>All Blogs</span>
      </Link>
      <Link to="/blogs/compose" className="w-fit" onClick={handleClick}>
        <div className="flex items-center justify-center gap-x-1 text-gray-600 hover:text-black cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          <span className="text-xl">Write</span>
        </div>
      </Link>
      <div className="hidden md:flex" onClick={handleClick}>
        <ProfileNav data={data} isLoading={isLoading} />
      </div>
    </ul>
  );
}

export function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const { data, isError, isLoading } = useGetCurrentUserQuery();

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  const handleClick = () => {
    setOpenNav(!openNav)
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="min-w-full py-2.5 shadow-none">
      <div className="flex items-center justify-between md:justify-between text-blue-gray-900">
        <div className="w-fit md:hidden">
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
            ripple={false}
            onClick={handleClick}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>

        <Link to="/">
          <div className="flex items-center">
            <img
              className="w-7 md:w-12"
              src="logo.png"
              alt="logo"
            />
            <span className="ml-1.5 uppercase font-100 text-xl md:text-3xl font-light">
              Socials
            </span>
          </div>
        </Link>
        <div className="hidden md:block">
          <NavList data={data} isLoading={isLoading} />
        </div>
        <div className="flex md:hidden">
          <ProfileNav data={data} isLoading={isLoading} />
        </div>
      </div>
      <Collapse open={openNav}>
        <NavList handleClick={handleClick}  data={data} isLoading={isLoading} />
      </Collapse>
    </Navbar>
  );
}
