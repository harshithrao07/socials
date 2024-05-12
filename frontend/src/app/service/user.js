import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const currentUserApi = createApi({
    reducerPath: "currentUser",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8787" }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: 'api/v1/auth/me',
                method: "GET",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token_socials")}` }
            })
        })
    })
})

export const {
    useGetCurrentUserQuery
} = currentUserApi