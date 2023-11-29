import {createAsyncThunk, createSlice, isFulfilled, isRejected} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IMovie, IPagination, IVideo, IVideoPagination} from "../../interfaces";
import {moviesService} from "../../services";

interface IState {
    movie: IMovie;
    movies: IMovie[];
    videos: IVideo[];
    lightTheme: boolean;
    searchTerm: string | number;
    error: boolean;
}

let initialState: IState = {
    movie: null,
    movies: [],
    videos: [],
    lightTheme: false,
    searchTerm: null,
    error: null
};

const getAll = createAsyncThunk<IPagination<IMovie>, { page: number }>(
    'moviesSlice/getAll',
    async ({page}, {rejectWithValue}) => {
        try {
            const {data} = await moviesService.getAll(page);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data);
        }
    }
);

const getById = createAsyncThunk<IMovie, { movieId: number }>(
    'moviesSlice/getById',
    async ({movieId}, {rejectWithValue}) => {
        try {
            const {data} = await moviesService.getById(movieId);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data);
        }
    }
);

const getOfGenre = createAsyncThunk<IPagination<IMovie>, { genreId: number, page: number }>(
    'moviesSlice/getOfGenre',
    async ({genreId, page}, {rejectWithValue}) => {
        try {
            const {data} = await moviesService.getMoviesOfGenre(genreId, page);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data);
        }
    }
);

const getFound = createAsyncThunk<IPagination<IMovie>, { searchTerm: string | number, page: number }>(
    'moviesSlice/getFound',
    async ({searchTerm, page}, {rejectWithValue}) => {
        try {
            const {data} = await moviesService.getFoundMovies(searchTerm, page);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data);
        }
    }
);

const getVideo = createAsyncThunk<IVideoPagination<IVideo>, { movieId: number }>(
    'moviesSlice/getVideo',
    async ({movieId}, {rejectWithValue}) => {
        try {
            const {data} = await moviesService.getVideo(movieId);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data);
        }
    }
);


const moviesSlice = createSlice({
    name: 'moviesSlice',
    initialState,
    reducers: {
        setLightTheme: (state => {
            state.lightTheme = !state.lightTheme;
        }),
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                state.movies = action.payload.results;
            })

            .addCase(getById.fulfilled, (state, action) => {
                state.movie = action.payload;
            })

            .addCase(getOfGenre.fulfilled, (state, action) => {
                state.movies = action.payload.results;
            })

            .addCase(getFound.fulfilled, (state, action) => {
                state.movies = action.payload.results;
            })

            .addCase(getVideo.fulfilled, (state, action) => {
                state.videos = action.payload.results;
            })

            .addMatcher(isFulfilled(getAll, getById, getOfGenre, getFound, getVideo), state => {
                state.error = null;
            })

            .addMatcher(isRejected(getAll, getById, getOfGenre, getFound, getVideo), state => {
                state.error = true;
            })
});

const {reducer: moviesReducer, actions} = moviesSlice;

const moviesActions = {
    ...actions,
    getAll,
    getById,
    getOfGenre,
    getFound,
    getVideo
};

export {
    moviesActions,
    moviesReducer
};