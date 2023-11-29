import {apiService} from "./api.service";
import {urls} from "../constants";
import {IRes} from "../types";
import {IGenreBadge, IGenreBadgePagination} from "../interfaces";

const genresService = {
    getAll(): IRes<IGenreBadgePagination<IGenreBadge>> {
        return apiService.get(urls.genres.list);
    }
};

export {genresService};