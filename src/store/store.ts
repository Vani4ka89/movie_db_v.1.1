import {configureStore} from "@reduxjs/toolkit";

import {moviesReducer, genresReducer} from "./slices";

const store = configureStore({
    reducer: {
        movies: moviesReducer,
        genres: genresReducer
    }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type {
    RootState,
    AppDispatch
};

export {store};