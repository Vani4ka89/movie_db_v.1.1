import axios from "axios";

import {accessToken, baseURL} from "../constants";

const apiService = axios.create({baseURL});
const missingTokenMessage = 'TMDB access token is missing. Add REACT_APP_TMDB_ACCESS_TOKEN to .env.local and restart the dev server.';

apiService.interceptors.request.use(req => {
    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
        return req;
    }

    return Promise.reject(new Error(missingTokenMessage));
});

apiService.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status === 401) {
            return Promise.reject(new Error('TMDB rejected the access token. Check REACT_APP_TMDB_ACCESS_TOKEN in .env.local and restart the dev server.'));
        }

        return Promise.reject(error);
    }
);

export {apiService};
