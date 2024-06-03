import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const socialsApi = createApi({
  reducerPath: "socials",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8787" }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "api/v1/auth/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_socials")}`,
        },
      }),
    }),

    getAllPosts: builder.query({
      query: () => ({
        url: `api/v1/posts`,
        method: "GET",
      }),
    }),

    getProfile: builder.query({
      query: (id) => ({
        url: `/api/v1/user/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetAllPostsQuery,
  useGetProfileQuery,
} = socialsApi;
