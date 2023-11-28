import axios from "axios";

import {accessToken, baseURL} from "../constants";

const apiService = axios.create({baseURL});

apiService.interceptors.request.use(req => {

    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
})

export {apiService};