import {IRes} from "../types";
import {IMovie, IPagination} from "../interfaces";
import {apiService} from "./api.service";
import {urls} from "../constants";

const moviesService = {
    getAll: (page: number): IRes<IPagination<IMovie>> => {
        return apiService.get(urls.movies.discover, {params: {page}});
    }
};

export {moviesService};