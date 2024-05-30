import React from "react";
import {
    MenuHandler,
    Menu,
    MenuList,
    MenuItem,
    Button,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const ProfileNav = ({ data, isLoading }) => {
  return (
    <div>
      <div className="text-lg">
        {data ? (
          <Menu>
            <MenuHandler>
              <div
                className={`bg-gray-700 mx-auto px-3 py-1 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit ${
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
                  <Link
                    to={`/profile/${data.id}/feed`}
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
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <span>Feed</span>
                  </Link>
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
    </div>
  );
};

export default ProfileNav;
