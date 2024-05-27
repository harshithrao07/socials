import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  IconButton,
  MenuHandler,
  Menu,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useGetCurrentUserQuery } from "../app/service/socials";


function NavList({ data, isLoading }) {
  return (
    <ul className="my-2 flex justify-center flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-7 font-200">
      <Link to="/" className="text-gray-600 hover:text-black text-xl">
        <span>Home</span>
      </Link>
      <Link
        to="/blogs?page=1"
        className="text-gray-600 hover:text-black text-xl"
      >
        <span>All Blogs</span>
      </Link>
      <Link to="/blogs/compose">
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
      <div className="text-lg">
        {data ? (
          <Menu>
            <MenuHandler>
              <div
                className={`bg-gray-700 px-3 py-1 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit ${
                  isLoading && "hidden"
                }`}
              >
                {data && data.name.substring(0, 1).toUpperCase()}
              </div>
            </MenuHandler>
            {data && (
              <MenuList className="font-200">
                <MenuItem>
                  <Link
                    to={`/profile/${data.id}`}
                    className="flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <span>Profile</span>
                  </Link>
                </MenuItem>
                <MenuItem className="flex items-center">
                  <Link
                    to={`/profile/${data.id}/saved`}
                    className="flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                    <span>Saved</span>
                  </Link>
                </MenuItem>
                <MenuItem className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <span>Following</span>
                </MenuItem>
                <MenuItem className="hover:bg-white">
                  <a href="/">
                    <Button
                      size="sm"
                      className="w-full opacity-70 hover:opacity-100"
                      variant="outlined"
                      onClick={() => {
                        localStorage.clear();
                      }}
                    >
                      Log Out
                    </Button>
                  </a>
                </MenuItem>
              </MenuList>
            )}
          </Menu>
        ) : isLoading ? (
          <></>
        ) : (
          <Link to="/signin">
            <Button
              variant="gradient"
              className="rounded-full font-200 font-medium"
              size="sm"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </ul>
  );
}

export function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const { data, isError, isLoading } = useGetCurrentUserQuery();

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="w-full py-2.5 shadow-none">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <div className="flex items-center">
            <img className="w-12" src="/src/assets/logo.png" alt="logo" />
            <span className="ml-1.5 uppercase font-100 text-3xl font-light">
              Socials
            </span>
          </div>
        </Link>
        <div className="hidden md:block">
          <NavList data={data} isLoading={isLoading} />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent md:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
