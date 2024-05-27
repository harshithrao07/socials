import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { socialsApi } from "./service/socials";

export const store = configureStore({
    reducer: {
        [socialsApi.reducerPath] : socialsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socialsApi.middleware),
})



setupListeners(store.dispatch)