const accessToken = process.env.REACT_APP_TMDB_ACCESS_TOKEN || '';

const baseURL = 'https://api.themoviedb.org/3';
const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';
const backdropBaseUrl = 'https://image.tmdb.org/t/p/w1280';
const profileBaseUrl = 'https://image.tmdb.org/t/p/w500';

const discover = '/discover/movie';
const movie = '/movie';
const genres = '/genre/movie/list';

const urls = {
    movies: {
        discover,
        // nowPlaying: `${movie}/now_playing`,
        // popular: `${movie}/popular`,
        // lists: (movieId: number): string => `${movie}/${movieId}/lists`,
        byId: (movieId: number): string => `${movie}/${movieId}`,
        search: '/search/movie',
        video: (movieId: number): string => `${movie}/${movieId}/videos`
    },
    genres: {
        list: genres,
        moviesOfGenre: (genreId: number): string => `/genre/${genreId}/movies`,
    }
};

export {
    accessToken,
    backdropBaseUrl,
    baseURL,
    profileBaseUrl,
    posterBaseUrl,
    urls
};
