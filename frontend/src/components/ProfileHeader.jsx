import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useGetProfileQuery,
} from "../app/service/socials";
import { followOrUnfollow, scrollToTop } from "../helper";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";

const ProfileNav = () => {
  const { id } = useParams();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch
  } = useGetProfileQuery(id);
  const { data: currentUserData, error: currentUserError } =
    useGetCurrentUserQuery();
  const navigate = useNavigate();
  const token = localStorage.getItem("token_socials");
  const [isCurrentUser, setIsCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [open, setOpen] = useState(false);


  const handleOpen = (type) => {
    setDialogType(type);
    setOpen(true);
  };

  useEffect(() => {
    refetch();
  }, [isFollowing])

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentUserData && profileData) {
      setIsCurrentUser(currentUserData.id === profileData.id);
      if (!isCurrentUser) {
        setLoading(true);
        setIsFollowing(
          currentUserData.following.some((user) => user.id === id)
        );
        setLoading(false);
      }
    }
  }, [profileData, currentUserData, id, isCurrentUser]);

  const toggleFollowOrUnfollowFunction = async () => {
    if (!token) {
      navigate("/signin?message=You have to sign up first!");
      return;
    }
    setLoading(true);
    await followOrUnfollow(id).then(() => {
      setIsFollowing((prev) => !prev);
    });
    setLoading(false);
  };

  if (profileError || currentUserError) {
    return <div>Error loading profile data. Please try again later.</div>;
  }

  return (
    <div>
      <div className="md:h-[25rem] font-200 profile-container text-white mx-6 rounded-xl mt-3 md:grid grid-cols-2">
        <div className="flex flex-wrap flex-col justify-center md:justify-end gap-y-3 p-5 md:p-12">
          {profileData && !isProfileLoading ? (
            <>
              <span className="text-3xl md:text-7xl">{profileData.name}</span>
              <span className="text-xl md:text-3xl">
                @{profileData.username}
              </span>
              <div>
                <span
                  className="mr-5 cursor-pointer"
                  onClick={() => handleOpen("followers")}
                >
                  {currentUserData?.username === profileData?.username
                    ? currentUserData?.followedBy.length
                    : profileData?.followedBy.length}
                  &nbsp;followers
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => handleOpen("following")}
                >
                  {currentUserData?.username === profileData?.username
                    ? currentUserData?.following.length
                    : profileData?.following.length}
                  &nbsp;following
                </span>
              </div>
              {currentUserData &&
                currentUserData?.id !== profileData?.id &&
                !isCurrentUser && (
                  <Button
                    onClick={toggleFollowOrUnfollowFunction}
                    color="white"
                    loading={loading}
                    className="w-fit rounded-full mt-1"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
            </>
          ) : (
            isProfileLoading && (
              <span className="text-3xl md:text-5xl italic">Loading...</span>
            )
          )}
        </div>
        <div className="relative overflow-hidden hidden md:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.5}
            stroke="currentColor"
            className="w-50 h-50 top-18 absolute"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </div>
        <Dialog open={open} handler={handleOpen} size="xs">
          <DialogHeader className="flex justify-center p-3 font-100 text-lg">
            <span>
              {dialogType === "followers"
                ? currentUserData?.id === profileData?.id
                  ? "Your followers"
                  : `@${profileData?.username}'s followers`
                : currentUserData?.id === profileData?.id
                ? "You're following"
                : `@${profileData?.username}'s following`}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7 cursor-pointer ml-auto hover:scale-105"
              onClick={handleClose}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </DialogHeader>
          <DialogBody className="p-0 font-200">
            {currentUserData?.id === profileData?.id ? (
              dialogType === "followers" ? (
                currentUserData?.followedBy.length > 0 ? (
                  currentUserData?.followedBy.map((follower) => (
                    <Link
                      to={`/profile/${follower.id}`}
                      key={follower.id}
                      onClick={handleClose}
                      className="outline-none"
                    >
                      <div className="flex items-center gap-x-3 py-2.5 px-2 hover:bg-gray-100 rounded-xl">
                        <div
                          className={`bg-gray-700 px-4 py-2 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit`}
                        >
                          <span className="font-bold">
                            {follower.name.substring(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center items-center leading-tight text-gray-800">
                          <span className="font-bold">
                            @{follower.username}
                          </span>
                          <span className="font-normal">{follower.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex justify-center mb-5 flex-col items-center">
                    <span className="text-black text-center">
                      You currently have no followers
                    </span>
                    <span className="text-black text-2xl">(⁠╥⁠﹏⁠╥⁠)</span>
                  </div>
                )
              ) : currentUserData?.following.length > 0 ? (
                currentUserData?.following.map((following) => (
                  <Link
                    to={`/profile/${following.id}`}
                    key={following.id}
                    onClick={handleClose}
                    className="outline-none"
                  >
                    <div className="flex items-center gap-x-3 py-2.5 px-2 hover:bg-gray-100 rounded-xl">
                      <div
                        className={`bg-gray-700 px-4 py-2 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit`}
                      >
                        <span className="font-bold">
                          {following.name.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-center leading-tight text-gray-800">
                        <span className="font-bold">@{following.username}</span>
                        <span className="font-normal">{following.name}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center mb-5 flex-col items-center">
                  <span className="text-black text-center">
                    You currently are not following anyone
                  </span>
                  <span className="text-black text-2xl">( ｡ • ᴖ • ｡)</span>
                </div>
              )
            ) : dialogType === "followers" ? (
              profileData?.followedBy.length > 0 ? (
                profileData?.followedBy.map((follower) => (
                  <Link
                    to={`/profile/${follower.id}`}
                    key={follower.id}
                    onClick={handleClose}
                    className="outline-none"
                  >
                    <div className="flex items-center gap-x-3 py-2.5 px-2 hover:bg-gray-100 rounded-xl">
                      <div
                        className={`bg-gray-700 px-4 py-2 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit`}
                      >
                        <span className="font-bold">
                          {follower.name.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-center leading-tight text-gray-800">
                        <span className="font-bold">@{follower.username}</span>
                        <span className="font-normal">{follower.name}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center mb-5 flex-col items-center">
                  <span className="text-black text-center">
                    @{profileData?.username} currently has no followers
                  </span>
                  <span className="text-black text-2xl">(⁠╥⁠﹏⁠╥⁠)</span>
                </div>
              )
            ) : profileData?.following.length > 0 ? (
              profileData?.following.map((following) => (
                <Link
                  to={`/profile/${following.id}`}
                  key={following.id}
                  onClick={handleClose}
                  className="outline-none"
                >
                  <div className="flex items-center gap-x-3 py-2.5 px-2 hover:bg-gray-100 rounded-xl">
                    <div
                      className={`bg-gray-700 px-4 py-2 rounded-full text-white hover:bg-gray-600 cursor-pointer flex w-fit`}
                    >
                      <span className="font-bold">
                        {following.name.substring(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-center leading-tight text-gray-800">
                      <span className="font-bold">@{following.username}</span>
                      <span className="font-normal">{following.name}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex justify-center mb-5 flex-col items-center">
                <span className="text-black text-center">
                  @{profileData?.username} currently is not following anyone
                </span>
                <span className="text-black text-2xl">( ｡ • ᴖ • ｡)</span>
              </div>
            )}
          </DialogBody>
        </Dialog>
      </div>
      <Outlet />
    </div>
  );
};

export default ProfileNav;
