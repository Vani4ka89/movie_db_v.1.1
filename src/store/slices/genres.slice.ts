import {createAsyncThunk, createSlice, isFulfilled, isRejected} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IGenreBadge, IGenreBadgePagination} from "../../interfaces";
import {genresService} from "../../services";

interface IState {
    badges: IGenreBadge[];
    error: boolean;
}

let initialState: IState = {
    badges: [],
    error: null
};

const getBadges = createAsyncThunk<IGenreBadgePagination<IGenreBadge>, void>(
    'genresSlice/getBadges',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await genresService.getAll();
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response.data);
        }
    }
);

const genresSlice = createSlice({
    name: 'genresSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getBadges.fulfilled, (state, action) => {
                state.badges = action.payload.genres;
            })

            .addMatcher(isFulfilled(getBadges), state => {
                state.error = null;
            })

            .addMatcher(isRejected(getBadges), state => {
                state.error = true;
            })
});

const {reducer: genresReducer, actions} = genresSlice;

const genresActions = {
    ...actions,
    getBadges
};

export {
    genresActions,
    genresReducer
};