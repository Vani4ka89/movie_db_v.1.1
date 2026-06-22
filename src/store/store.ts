import {configureStore} from "@reduxjs/toolkit";

import {genresReducer, moviesReducer, tmdbReducer} from "./slices";

const store = configureStore({
    reducer: {
        movies: moviesReducer,
        genres: genresReducer,
        tmdb: tmdbReducer
    }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type {
    RootState,
    AppDispatch
};

export {store};
