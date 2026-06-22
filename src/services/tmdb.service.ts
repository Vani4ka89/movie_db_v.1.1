import {AxiosRequestConfig} from "axios";

import {IRes} from "../types";
import {
    ITmdbMenuItem,
    TmdbEntityDetail,
    TmdbEntityType,
    TmdbDetail,
    TmdbMediaType
} from "../interfaces";
import {apiService} from "./api.service";

const detailAppendMap: Record<TmdbMediaType, string> = {
    movie: [
        'credits',
        'videos',
        'images',
        'recommendations',
        'similar',
        'reviews',
        'external_ids',
        'keywords',
        'alternative_titles',
        'release_dates',
        'watch/providers',
        'translations'
    ].join(','),
    tv: [
        'credits',
        'aggregate_credits',
        'videos',
        'images',
        'recommendations',
        'similar',
        'reviews',
        'external_ids',
        'keywords',
        'alternative_titles',
        'content_ratings',
        'watch/providers',
        'translations'
    ].join(','),
    person: [
        'combined_credits',
        'movie_credits',
        'tv_credits',
        'images',
        'tagged_images',
        'external_ids',
        'translations'
    ].join(',')
};

const tmdbService = {
    getExplore<T>(
        menuItem: ITmdbMenuItem,
        params: Record<string, string | number | boolean> = {},
        signal?: AbortSignal
    ): IRes<T> {
        const externalId = String(params.externalId || '');
        const path = menuItem.path.replace(':externalId', encodeURIComponent(externalId));
        const requestParams = {...params};
        delete requestParams.externalId;
        const requestConfig: AxiosRequestConfig = {
            params: {
                language: 'en-US',
                ...menuItem.defaultParams,
                ...requestParams
            },
            signal
        };

        return apiService.get(path, requestConfig);
    },

    getDetail<T extends TmdbDetail>(
        mediaType: TmdbMediaType,
        id: number,
        signal?: AbortSignal
    ): IRes<T> {
        return apiService.get(`/${mediaType}/${id}`, {
            params: {
                language: 'en-US',
                append_to_response: detailAppendMap[mediaType],
                include_image_language: 'en,null'
            },
            signal
        });
    },

    async getEntityDetail<T extends TmdbEntityDetail>(
        entityType: TmdbEntityType,
        id: number,
        signal?: AbortSignal
    ): Promise<T> {
        if (entityType === 'collection') {
            const [detailResponse, imagesResponse] = await Promise.all([
                apiService.get(`/collection/${id}`, {params: {language: 'en-US'}, signal}),
                apiService.get(`/collection/${id}/images`, {signal})
            ]);

            return {
                ...detailResponse.data,
                media_type: 'collection',
                images: imagesResponse.data
            } as T;
        }

        if (entityType === 'company') {
            const [detailResponse, alternativeNamesResponse, imagesResponse] = await Promise.all([
                apiService.get(`/company/${id}`, {signal}),
                apiService.get(`/company/${id}/alternative_names`, {signal}),
                apiService.get(`/company/${id}/images`, {signal})
            ]);

            return {
                ...detailResponse.data,
                media_type: 'company',
                alternative_names: alternativeNamesResponse.data?.results || [],
                images: {
                    logos: imagesResponse.data?.logos || []
                }
            } as T;
        }

        const [detailResponse, moviesResponse] = await Promise.all([
            apiService.get(`/keyword/${id}`, {signal}),
            apiService.get('/discover/movie', {
                params: {
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    include_adult: false,
                    with_keywords: id
                },
                signal
            })
        ]);

        return {
            ...detailResponse.data,
            media_type: 'keyword',
            movies: moviesResponse.data
        } as T;
    }
};

export {detailAppendMap, tmdbService};
