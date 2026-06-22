import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import css from './GenreBadgesOfMovie.module.css';
import {moviesActions} from "../../../store";
import {IGenreBadge} from "../../../interfaces";

const GenreBadgesOfMovie = () => {
    const {movieId} = useParams<{ movieId: string }>();
    const {movie, lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(moviesActions.getById({movieId: +movieId}))
    }, [movieId, dispatch]);

    if (!movie?.genres?.length) {
        return null;
    }

    const {genres} = movie;

    const getGenreMovies = (genreId: number) => {
        navigate(`/movies/genre/${genreId}?page=1`);
        dispatch(moviesActions.setSearchTerm(''));
    };

    return (
        <div className={`${lightTheme ? `${css.GenreBadgesOfMovieLight}` : `${css.GenreBadgesOfMovieDark}`}`}>
            {genres.map((genre: IGenreBadge) => <button key={genre.id} onClick={() => getGenreMovies(genre.id)}>{genre.name}</button>)}
        </div>
    );
};

export {GenreBadgesOfMovie};
