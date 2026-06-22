import {IGenreBadge} from "./genreBadge.interface";
import {IPagination} from "./pagination.interface";
import {IVideo, IVideoPagination} from "./video.interface";

export type TmdbMediaType = 'movie' | 'tv' | 'person';
export type TmdbEntityType = 'collection' | 'company' | 'keyword';
export type TmdbExploreSection =
    'movies'
    | 'tv'
    | 'people'
    | 'trending'
    | 'search'
    | 'find'
    | 'changes'
    | 'certifications'
    | 'genres'
    | 'watch-providers'
    | 'collections'
    | 'companies'
    | 'keywords'
    | 'configuration';

export type TmdbExploreKind = 'discover' | 'list' | 'search' | 'find' | 'static';
export type TmdbResultType =
    'mixed'
    | 'movie'
    | 'tv'
    | 'person'
    | 'genre'
    | 'provider'
    | 'collection'
    | 'company'
    | 'keyword'
    | 'language'
    | 'country'
    | 'timezone'
    | 'configuration'
    | 'certification'
    | 'job'
    | 'translation'
    | 'change';

export interface ITmdbMenuItem {
    section: TmdbExploreSection;
    endpoint: string;
    label: string;
    group: string;
    description: string;
    path: string;
    kind: TmdbExploreKind;
    resultType: TmdbResultType;
    mediaType?: TmdbMediaType;
    requiresQuery?: boolean;
    queryPlaceholder?: string;
    externalSource?: string;
    defaultParams?: Record<string, string | number | boolean>;
    badge?: string;
}

export interface ITmdbMovie {
    adult?: boolean;
    backdrop_path?: string;
    genre_ids?: number[];
    genres?: IGenreBadge[];
    id: number;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: string;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    media_type?: 'movie';
}

export interface ITmdbTV {
    adult?: boolean;
    backdrop_path?: string;
    first_air_date?: string;
    genre_ids?: number[];
    genres?: IGenreBadge[];
    id: number;
    name?: string;
    original_language?: string;
    original_name?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    vote_average?: number;
    vote_count?: number;
    media_type?: 'tv';
}

export interface ITmdbPerson {
    adult?: boolean;
    also_known_as?: string[];
    biography?: string;
    birthday?: string;
    deathday?: string;
    gender?: number;
    homepage?: string;
    id: number;
    imdb_id?: string;
    known_for?: Array<ITmdbMovie | ITmdbTV>;
    known_for_department?: string;
    name?: string;
    place_of_birth?: string;
    popularity?: number;
    profile_path?: string;
    media_type?: 'person';
}

export interface ITmdbCollection {
    id: number;
    name: string;
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    media_type?: 'collection';
}

export interface ITmdbCompany {
    id: number;
    name: string;
    logo_path?: string;
    origin_country?: string;
    description?: string;
    headquarters?: string;
    homepage?: string;
    media_type?: 'company';
}

export interface ITmdbKeyword {
    id: number;
    name: string;
    media_type?: 'keyword';
}

export interface ITmdbProvider {
    display_priority?: number;
    logo_path?: string;
    provider_id: number;
    provider_name: string;
}

export interface ITmdbLanguage {
    iso_639_1: string;
    english_name: string;
    name: string;
}

export interface ITmdbCountry {
    iso_3166_1: string;
    english_name: string;
    native_name?: string;
}

export interface ITmdbTimezone {
    iso_3166_1: string;
    zones: string[];
}

export interface ITmdbImageConfiguration {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
}

export interface ITmdbConfiguration {
    images: ITmdbImageConfiguration;
    change_keys: string[];
}

export interface ITmdbCertification {
    id: string;
    iso_3166_1: string;
    certification: string;
    meaning: string;
    order: number;
    media_type?: 'certification';
}

export interface ITmdbJobDepartment {
    id: string;
    department: string;
    jobs: string[];
    media_type?: 'job';
}

export interface ITmdbPrimaryTranslation {
    id: string;
    code: string;
    media_type?: 'translation';
}

export interface ITmdbChangeItem {
    id: number;
    adult?: boolean;
    media_type: TmdbMediaType;
}

export interface ITmdbAlternativeTitle {
    iso_3166_1: string;
    title: string;
    type?: string;
}

export interface ITmdbAlternativeTitles {
    titles?: ITmdbAlternativeTitle[];
    results?: ITmdbAlternativeTitle[];
}

export interface ITmdbReleaseDate {
    certification?: string;
    descriptors?: string[];
    iso_639_1?: string;
    note?: string;
    release_date: string;
    type: number;
}

export interface ITmdbReleaseDateRegion {
    iso_3166_1: string;
    release_dates: ITmdbReleaseDate[];
}

export interface ITmdbReleaseDates {
    results: ITmdbReleaseDateRegion[];
}

export interface ITmdbContentRating {
    descriptors?: string[];
    iso_3166_1: string;
    rating: string;
}

export interface ITmdbContentRatings {
    results: ITmdbContentRating[];
}

export interface ITmdbCastMember {
    adult?: boolean;
    cast_id?: number;
    character?: string;
    credit_id: string;
    episode_count?: number;
    id: number;
    known_for_department?: string;
    name: string;
    order?: number;
    original_name?: string;
    popularity?: number;
    profile_path?: string;
    roles?: Array<{ credit_id: string; character: string; episode_count: number }>;
    total_episode_count?: number;
}

export interface ITmdbCrewMember {
    adult?: boolean;
    credit_id: string;
    department?: string;
    episode_count?: number;
    id: number;
    job?: string;
    jobs?: Array<{ credit_id: string; job: string; episode_count: number }>;
    known_for_department?: string;
    name: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string;
    total_episode_count?: number;
}

export interface ITmdbCredits {
    cast: ITmdbCastMember[];
    crew: ITmdbCrewMember[];
}

export interface ITmdbImage {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1?: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface ITmdbImages {
    backdrops?: ITmdbImage[];
    logos?: ITmdbImage[];
    posters?: ITmdbImage[];
    profiles?: ITmdbImage[];
}

export interface ITmdbReview {
    author: string;
    author_details?: {
        name?: string;
        username?: string;
        avatar_path?: string;
        rating?: number;
    };
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
}

export interface ITmdbExternalIds {
    facebook_id?: string;
    freebase_id?: string;
    freebase_mid?: string;
    imdb_id?: string;
    instagram_id?: string;
    tiktok_id?: string;
    tvdb_id?: number;
    twitter_id?: string;
    wikidata_id?: string;
    youtube_id?: string;
}

export interface ITmdbWatchProviderRegion {
    link?: string;
    flatrate?: ITmdbProvider[];
    rent?: ITmdbProvider[];
    buy?: ITmdbProvider[];
    ads?: ITmdbProvider[];
    free?: ITmdbProvider[];
}

export interface ITmdbWatchProviders {
    id?: number;
    results: Record<string, ITmdbWatchProviderRegion>;
}

export interface ITmdbTranslation {
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    english_name: string;
    data?: {
        title?: string;
        name?: string;
        overview?: string;
        homepage?: string;
        tagline?: string;
        biography?: string;
    };
}

export interface ITmdbTranslations {
    translations: ITmdbTranslation[];
}

export interface ITmdbMovieDetail extends ITmdbMovie {
    budget?: number;
    homepage?: string;
    imdb_id?: string;
    production_companies?: ITmdbCompany[];
    production_countries?: ITmdbCountry[];
    recommendations?: IPagination<ITmdbMovie>;
    release_date?: string;
    revenue?: number;
    runtime?: number;
    similar?: IPagination<ITmdbMovie>;
    spoken_languages?: ITmdbLanguage[];
    status?: string;
    tagline?: string;
    credits?: ITmdbCredits;
    videos?: IVideoPagination<IVideo>;
    images?: ITmdbImages;
    reviews?: IPagination<ITmdbReview>;
    external_ids?: ITmdbExternalIds;
    keywords?: { keywords?: ITmdbKeyword[]; results?: ITmdbKeyword[] };
    alternative_titles?: ITmdbAlternativeTitles;
    release_dates?: ITmdbReleaseDates;
    "watch/providers"?: ITmdbWatchProviders;
    translations?: ITmdbTranslations;
}

export interface ITmdbTVDetail extends ITmdbTV {
    created_by?: Array<{ id: number; name: string; profile_path?: string }>;
    episode_run_time?: number[];
    homepage?: string;
    in_production?: boolean;
    languages?: string[];
    last_air_date?: string;
    networks?: ITmdbCompany[];
    number_of_episodes?: number;
    number_of_seasons?: number;
    production_companies?: ITmdbCompany[];
    production_countries?: ITmdbCountry[];
    recommendations?: IPagination<ITmdbTV>;
    seasons?: Array<{ id: number; name: string; season_number: number; episode_count: number; poster_path?: string }>;
    similar?: IPagination<ITmdbTV>;
    spoken_languages?: ITmdbLanguage[];
    status?: string;
    tagline?: string;
    type?: string;
    credits?: ITmdbCredits;
    aggregate_credits?: ITmdbCredits;
    videos?: IVideoPagination<IVideo>;
    images?: ITmdbImages;
    reviews?: IPagination<ITmdbReview>;
    external_ids?: ITmdbExternalIds;
    keywords?: { results?: ITmdbKeyword[]; keywords?: ITmdbKeyword[] };
    alternative_titles?: ITmdbAlternativeTitles;
    content_ratings?: ITmdbContentRatings;
    "watch/providers"?: ITmdbWatchProviders;
    translations?: ITmdbTranslations;
}

export interface ITmdbPersonDetail extends ITmdbPerson {
    combined_credits?: ITmdbCredits;
    movie_credits?: ITmdbCredits;
    tv_credits?: ITmdbCredits;
    images?: ITmdbImages;
    tagged_images?: IPagination<ITmdbImage & { media?: ITmdbMovie | ITmdbTV; media_type?: TmdbMediaType }>;
    external_ids?: ITmdbExternalIds;
    translations?: ITmdbTranslations;
}

export type TmdbDetail = ITmdbMovieDetail | ITmdbTVDetail | ITmdbPersonDetail;

export interface ITmdbCollectionDetail extends ITmdbCollection {
    parts?: ITmdbMovie[];
    images?: ITmdbImages;
}

export interface ITmdbCompanyAlternativeName {
    name: string;
    type?: string;
}

export interface ITmdbCompanyDetail extends ITmdbCompany {
    alternative_names?: ITmdbCompanyAlternativeName[];
    images?: ITmdbImages;
}

export interface ITmdbKeywordDetail extends ITmdbKeyword {
    movies?: IPagination<ITmdbMovie>;
}

export type TmdbEntityDetail = ITmdbCollectionDetail | ITmdbCompanyDetail | ITmdbKeywordDetail;

export type TmdbExploreItem =
    ITmdbMovie
    | ITmdbTV
    | ITmdbPerson
    | ITmdbCollection
    | ITmdbCompany
    | ITmdbKeyword
    | ITmdbProvider
    | ITmdbLanguage
    | ITmdbCountry
    | ITmdbTimezone
    | ITmdbConfiguration
    | ITmdbCertification
    | ITmdbJobDepartment
    | ITmdbPrimaryTranslation
    | ITmdbChangeItem
    | IGenreBadge;

export interface ITmdbExplorePayload {
    cacheKey: string;
    item: ITmdbMenuItem;
    items: TmdbExploreItem[];
    page: number;
    total_pages: number;
    total_results: number;
    fromCache?: boolean;
}
