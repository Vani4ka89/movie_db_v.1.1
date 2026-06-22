import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {
    ITmdbCertification,
    ITmdbConfiguration,
    ITmdbCountry,
    ITmdbExplorePayload,
    ITmdbJobDepartment,
    ITmdbLanguage,
    ITmdbMovie,
    ITmdbPerson,
    ITmdbPrimaryTranslation,
    ITmdbProvider,
    ITmdbTV,
    ITmdbTimezone,
    TmdbEntityDetail,
    TmdbEntityType,
    TmdbDetail,
    TmdbExploreItem,
    TmdbMediaType
} from "../../interfaces";
import {getTmdbMenuItem} from "../../constants";
import {tmdbService} from "../../services";

interface IStaticCacheEntry {
    items: TmdbExploreItem[];
    page: number;
    total_pages: number;
    total_results: number;
}

interface ITmdbState {
    cacheKey: string;
    itemLabel: string;
    items: TmdbExploreItem[];
    page: number;
    totalPages: number;
    totalResults: number;
    loading: boolean;
    error: string;
    staticCache: Record<string, IStaticCacheEntry>;
    detail: TmdbDetail;
    detailKey: string;
    detailLoading: boolean;
    detailError: string;
    entityDetail: TmdbEntityDetail;
    entityDetailKey: string;
    entityDetailLoading: boolean;
    entityDetailError: string;
}

const initialState: ITmdbState = {
    cacheKey: '',
    itemLabel: '',
    items: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
    staticCache: {},
    detail: null,
    detailKey: '',
    detailLoading: false,
    detailError: null,
    entityDetail: null,
    entityDetailKey: '',
    entityDetailLoading: false,
    entityDetailError: null
};

const attachResultType = (items: TmdbExploreItem[], mediaType?: TmdbMediaType, resultType?: string): TmdbExploreItem[] => {
    if (!mediaType && !resultType) {
        return items;
    }

    return items.map(item => {
        if (!item || typeof item !== 'object') {
            return item;
        }

        if (mediaType && !('media_type' in item)) {
            return {...item, media_type: mediaType} as TmdbExploreItem;
        }

        if (resultType === 'collection' && !('media_type' in item)) {
            return {...item, media_type: 'collection'} as TmdbExploreItem;
        }

        if (resultType === 'company' && !('media_type' in item)) {
            return {...item, media_type: 'company'} as TmdbExploreItem;
        }

        if (resultType === 'keyword' && !('media_type' in item)) {
            return {...item, media_type: 'keyword'} as TmdbExploreItem;
        }

        return item;
    });
};

const normalizeFindItems = (data: unknown): TmdbExploreItem[] => {
    if (!data || typeof data !== 'object') {
        return [];
    }

    const payload = data as {
        movie_results?: ITmdbMovie[];
        tv_results?: ITmdbTV[];
        person_results?: ITmdbPerson[];
    };

    return [
        ...(payload.movie_results || []).map(item => ({...item, media_type: 'movie' as const})),
        ...(payload.tv_results || []).map(item => ({...item, media_type: 'tv' as const})),
        ...(payload.person_results || []).map(item => ({...item, media_type: 'person' as const}))
    ];
};

const normalizeStaticItems = (data: unknown): TmdbExploreItem[] => {
    if (Array.isArray(data)) {
        if (data.every(item => typeof item === 'string')) {
            return (data as string[]).map((code): ITmdbPrimaryTranslation => ({
                id: code,
                code,
                media_type: 'translation'
            }));
        }

        if (data.every(item => item && typeof item === 'object' && 'department' in item && 'jobs' in item)) {
            return (data as Array<{ department: string; jobs: string[] }>).map((item): ITmdbJobDepartment => ({
                id: item.department,
                department: item.department,
                jobs: item.jobs,
                media_type: 'job'
            }));
        }

        return data as TmdbExploreItem[];
    }

    if (!data || typeof data !== 'object') {
        return [];
    }

    const payload = data as {
        genres?: TmdbExploreItem[];
        results?: TmdbExploreItem[];
        images?: ITmdbConfiguration['images'];
        change_keys?: string[];
        certifications?: Record<string, Array<{ certification: string; meaning: string; order: number }>>;
    };

    if (Array.isArray(payload.genres)) {
        return payload.genres;
    }

    if (Array.isArray(payload.results)) {
        return payload.results;
    }

    if (payload.images) {
        return [data as ITmdbConfiguration];
    }

    if (payload.certifications) {
        return Object.entries(payload.certifications).flatMap(([country, certifications]) =>
            certifications.map((certification): ITmdbCertification => ({
                id: `${country}-${certification.certification || certification.order}`,
                iso_3166_1: country,
                certification: certification.certification || 'Unrated',
                meaning: certification.meaning,
                order: certification.order,
                media_type: 'certification'
            }))
        );
    }

    return [];
};

const getExplore = createAsyncThunk<
    ITmdbExplorePayload,
    { section: string; endpoint: string; page: number; query?: string; source?: string },
    { state: { tmdb: ITmdbState } }
>(
    'tmdbSlice/getExplore',
    async ({section, endpoint, page, query, source}, {getState, rejectWithValue, signal}) => {
        const item = getTmdbMenuItem(section, endpoint);

        if (!item) {
            return rejectWithValue('Unknown TMDB endpoint');
        }

        const cacheKey = `${item.section}/${item.endpoint}`;
        const cached = getState().tmdb.staticCache[cacheKey];

        if (item.kind === 'static' && cached) {
            return {
                cacheKey,
                item,
                ...cached,
                fromCache: true
            };
        }

        if (item.requiresQuery && !query?.trim()) {
            return {
                cacheKey,
                item,
                items: [],
                page: 1,
                total_pages: 1,
                total_results: 0
            };
        }

        try {
            const params: Record<string, string | number | boolean> = item.kind === 'static'
                ? {}
                : {page};

            if (item.kind === 'find') {
                params.externalId = query.trim();
                params.external_source = source || item.externalSource || 'imdb_id';
            }

            if (item.requiresQuery) {
                if (item.kind !== 'find') {
                    params.query = query.trim();
                }
                params.include_adult = false;
            }

            const {data} = await tmdbService.getExplore<{
                page?: number;
                results?: TmdbExploreItem[];
                total_pages?: number;
                total_results?: number;
                genres?: TmdbExploreItem[];
            } | ITmdbLanguage[] | ITmdbCountry[] | ITmdbTimezone[] | { results: ITmdbProvider[] } | ITmdbConfiguration>(
                item,
                params,
                signal
            );

            if (item.kind === 'find') {
                const items = normalizeFindItems(data);

                return {
                    cacheKey,
                    item,
                    items,
                    page: 1,
                    total_pages: 1,
                    total_results: items.length
                };
            }

            if (item.kind === 'static') {
                const items = normalizeStaticItems(data);

                return {
                    cacheKey,
                    item,
                    items,
                    page: 1,
                    total_pages: 1,
                    total_results: items.length
                };
            }

            const listPayload = data as {
                page?: number;
                results?: TmdbExploreItem[];
                total_pages?: number;
                total_results?: number;
            };

            return {
                cacheKey,
                item,
                items: attachResultType(listPayload.results || [], item.mediaType, item.resultType),
                page: listPayload.page || page,
                total_pages: listPayload.total_pages || 1,
                total_results: listPayload.total_results || 0
            };
        } catch (e) {
            const err = e as AxiosError<{ status_message?: string }>;
            return rejectWithValue(err.response?.data?.status_message || err.message);
        }
    }
);

const getDetail = createAsyncThunk<
    { mediaType: TmdbMediaType; id: number; detail: TmdbDetail },
    { mediaType: TmdbMediaType; id: number }
>(
    'tmdbSlice/getDetail',
    async ({mediaType, id}, {rejectWithValue, signal}) => {
        try {
            const {data} = await tmdbService.getDetail(mediaType, id, signal);
            return {mediaType, id, detail: data};
        } catch (e) {
            const err = e as AxiosError<{ status_message?: string }>;
            return rejectWithValue(err.response?.data?.status_message || err.message);
        }
    }
);

const getEntityDetail = createAsyncThunk<
    { entityType: TmdbEntityType; id: number; detail: TmdbEntityDetail },
    { entityType: TmdbEntityType; id: number }
>(
    'tmdbSlice/getEntityDetail',
    async ({entityType, id}, {rejectWithValue, signal}) => {
        try {
            const data = await tmdbService.getEntityDetail(entityType, id, signal);
            return {entityType, id, detail: data};
        } catch (e) {
            const err = e as AxiosError<{ status_message?: string }>;
            return rejectWithValue(err.response?.data?.status_message || err.message);
        }
    }
);

const tmdbSlice = createSlice({
    name: 'tmdbSlice',
    initialState,
    reducers: {
        clearExploreError: state => {
            state.error = null;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getExplore.pending, (state, action) => {
                const cacheKey = `${action.meta.arg.section}/${action.meta.arg.endpoint}`;
                const hasStaticCache = Boolean(state.staticCache[cacheKey]);

                state.cacheKey = cacheKey;
                state.error = null;
                state.loading = !hasStaticCache;

                if (!hasStaticCache) {
                    state.items = [];
                    state.totalPages = 1;
                    state.totalResults = 0;
                }
            })
            .addCase(getExplore.fulfilled, (state, action) => {
                state.cacheKey = action.payload.cacheKey;
                state.itemLabel = action.payload.item.label;
                state.items = action.payload.items;
                state.page = action.payload.page;
                state.totalPages = action.payload.total_pages;
                state.totalResults = action.payload.total_results;
                state.loading = false;
                state.error = null;

                if (action.payload.item.kind === 'static') {
                    state.staticCache[action.payload.cacheKey] = {
                        items: action.payload.items,
                        page: action.payload.page,
                        total_pages: action.payload.total_pages,
                        total_results: action.payload.total_results
                    };
                }
            })
            .addCase(getExplore.rejected, (state, action) => {
                if (action.meta.aborted) {
                    return;
                }

                state.loading = false;
                state.error = String(action.payload || action.error.message || 'TMDB request failed');
                state.items = [];
            })
            .addCase(getDetail.pending, (state, action) => {
                state.detailKey = `${action.meta.arg.mediaType}/${action.meta.arg.id}`;
                state.detail = null;
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(getDetail.fulfilled, (state, action) => {
                state.detailKey = `${action.payload.mediaType}/${action.payload.id}`;
                state.detail = action.payload.detail;
                state.detailLoading = false;
                state.detailError = null;
            })
            .addCase(getDetail.rejected, (state, action) => {
                if (action.meta.aborted) {
                    return;
                }

                state.detailLoading = false;
                state.detailError = String(action.payload || action.error.message || 'TMDB detail request failed');
                state.detail = null;
            })
            .addCase(getEntityDetail.pending, (state, action) => {
                state.entityDetailKey = `${action.meta.arg.entityType}/${action.meta.arg.id}`;
                state.entityDetail = null;
                state.entityDetailLoading = true;
                state.entityDetailError = null;
            })
            .addCase(getEntityDetail.fulfilled, (state, action) => {
                state.entityDetailKey = `${action.payload.entityType}/${action.payload.id}`;
                state.entityDetail = action.payload.detail;
                state.entityDetailLoading = false;
                state.entityDetailError = null;
            })
            .addCase(getEntityDetail.rejected, (state, action) => {
                if (action.meta.aborted) {
                    return;
                }

                state.entityDetailLoading = false;
                state.entityDetailError = String(action.payload || action.error.message || 'TMDB entity detail request failed');
                state.entityDetail = null;
            })
});

const {reducer: tmdbReducer, actions} = tmdbSlice;

const tmdbActions = {
    ...actions,
    getExplore,
    getDetail,
    getEntityDetail
};

export {
    tmdbActions,
    tmdbReducer
};
