import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { currentUserApi } from "./service/user";

export const store = configureStore({
    reducer: {
        [currentUserApi.reducerPath] : currentUserApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(currentUserApi.middleware),
})

setupListeners(store.dispatch)