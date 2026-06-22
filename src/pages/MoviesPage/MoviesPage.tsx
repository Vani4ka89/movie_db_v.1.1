import {CSSProperties, FC, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {Rating} from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {BadgesList, MoviesList, Pagination} from "../../components";
import {backdropBaseUrl, posterBaseUrl} from "../../constants";
import {useAppSelector} from "../../hooks";
import {IMovie} from "../../interfaces";
import css from './MoviesPage.module.css';

const MoviesPage: FC = () => {

    const [query, setQuery] = useSearchParams();
    const navigate = useNavigate();
    const {error, loading, movies} = useAppSelector(state => state.movies);

    const page = query.get('page');
    const heroMovie = movies[0];
    const sideMovies = movies.slice(1, 3);

    useEffect(() => {
        if (!page) {
            setQuery({page: '1'});
        }
    }, [page, setQuery]);

    const openMovie = (movie: IMovie) => {
        navigate(`/movies/${movie.id}`, {state: {...movie}});
    };

    const openVideo = (movie: IMovie) => {
        navigate(`/movies/${movie.id}/video`, {state: {...movie}});
    };

    const heroStyle = {
        '--hero-backdrop': heroMovie?.backdrop_path ? `url(${backdropBaseUrl}${heroMovie.backdrop_path})` : 'none'
    } as CSSProperties;

    return (
        <div className={css.MoviesPage}>
            {!loading && !error && heroMovie && (
                <section className={css.hero} style={heroStyle} aria-labelledby="featured-movie-title">
                    <div className={css.heroCopy}>
                        <span className={css.heroEyebrow}>Now in spotlight</span>
                        <h1 id="featured-movie-title">{heroMovie.title || heroMovie.original_title}</h1>
                        <div className={css.heroMeta}>
                            <span>{heroMovie.release_date || 'Release TBA'}</span>
                            <span>{heroMovie.original_language?.toUpperCase() || 'TMDB'}</span>
                            <span>{heroMovie.vote_count ? `${heroMovie.vote_count.toLocaleString('en-US')} votes` : 'New title'}</span>
                        </div>
                        <p>{heroMovie.overview || 'Open the movie page to explore cast, trailers, images and recommendations.'}</p>
                        <div className={css.heroActions}>
                            <button type="button" className={css.primaryAction} onClick={() => openVideo(heroMovie)}>
                                <PlayArrowRoundedIcon fontSize="small"/>
                                <span>Watch trailer</span>
                            </button>
                            <button type="button" className={css.secondaryAction} onClick={() => openMovie(heroMovie)}>
                                <InfoOutlinedIcon fontSize="small"/>
                                <span>Details</span>
                            </button>
                        </div>
                    </div>

                    <div className={css.posterStage}>
                        {heroMovie.poster_path ? (
                            <img src={`${posterBaseUrl}${heroMovie.poster_path}`} alt={heroMovie.title || heroMovie.original_title}/>
                        ) : (
                            <div className={css.posterFallback} aria-hidden="true">
                                {(heroMovie.title || heroMovie.original_title || 'M').charAt(0)}
                            </div>
                        )}
                        <div className={css.ratingPanel} aria-label={`Rating ${heroMovie.vote_average?.toFixed(1) || 'not rated'} out of 10`}>
                            <strong>{heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'NR'}</strong>
                            <Rating
                                className={css.rating}
                                name={`featured-rating-${heroMovie.id}`}
                                value={heroMovie.vote_average / 2}
                                readOnly
                                max={5}
                                precision={0.1}
                                size="small"
                            />
                        </div>
                    </div>

                    {!!sideMovies.length && (
                        <aside className={css.sideRail} aria-label="More featured movies">
                            {sideMovies.map(movie => (
                                <button
                                    key={movie.id}
                                    type="button"
                                    className={css.sideCard}
                                    onClick={() => openMovie(movie)}
                                    style={{
                                        '--side-backdrop': movie.backdrop_path ? `url(${backdropBaseUrl}${movie.backdrop_path})` : movie.poster_path ? `url(${posterBaseUrl}${movie.poster_path})` : 'none'
                                    } as CSSProperties}
                                >
                                    <span>{movie.release_date?.substring(0, 4) || 'TBA'}</span>
                                    <strong>{movie.title || movie.original_title}</strong>
                                </button>
                            ))}
                        </aside>
                    )}
                </section>
            )}
            <BadgesList/>
            <MoviesList/>
            <Pagination/>
        </div>
    );
};

export {MoviesPage};
