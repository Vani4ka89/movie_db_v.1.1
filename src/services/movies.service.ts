import {IRes} from "../types";
import {IMovie, IPagination, IVideo, IVideoPagination} from "../interfaces";
import {apiService} from "./api.service";
import {urls} from "../constants";

const moviesService = {
    getAll(page: number): IRes<IPagination<IMovie>> {
        return apiService.get(urls.movies.discover, {params: {page}});
    },
    getById(movieId: number): IRes<IMovie> {
        return apiService.get(urls.movies.byId(movieId));
    },
    getMoviesOfGenre(genreId: number, page: number): IRes<IPagination<IMovie>> {
        return apiService.get(urls.genres.moviesOfGenre(genreId), {params: {page}});
    },
    getFoundMovies(searchTerm: string | number, page: number): IRes<IPagination<IMovie>> {
        return apiService.get(urls.movies.search(searchTerm), {params: {page}});
    },
    getVideo(movieId: number): IRes<IVideoPagination<IVideo>> {
        return apiService.get(urls.movies.video(movieId));
    }
};

export {moviesService};