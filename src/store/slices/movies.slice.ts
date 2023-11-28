import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IMovie, IPagination} from "../../interfaces";
import {moviesService} from "../../services";

interface IState {
    movies: IMovie[];
    lightTheme: boolean;
}

let initialState: IState = {
    movies: [],
    lightTheme: false
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

const moviesSlice = createSlice({
    name: 'moviesSlice',
    initialState,
    reducers: {
        setLightTheme: (state => {
            state.lightTheme = !state.lightTheme;
        })
    },
    extraReducers: builder =>
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                const {results} = action.payload;
                state.movies = results;
            })
});

const {reducer: moviesReducer, actions} = moviesSlice;

const moviesActions = {
    ...actions,
    getAll
};

export {
    moviesActions,
    moviesReducer
};