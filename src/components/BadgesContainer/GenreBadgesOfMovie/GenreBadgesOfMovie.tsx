import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {Loading} from "../../Loading/Loading";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import css from './GenreBadgesOfMovie.module.css';
import {moviesActions} from "../../../store";

const GenreBadgesOfMovie = () => {
    const {movieId} = useParams<{ movieId: string }>();
    const {movie, lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(moviesActions.getById({movieId: +movieId}))
    }, [movieId, dispatch]);

    if (!movie) {
        return <Loading/>
    }

    const {genres} = movie;

    const getGenreMovies = (genreId: number) => {
        navigate(`/movies/genre/${genreId}`);
        dispatch(moviesActions.setSearchTerm(''));
    };

    return (
        <div className={`${lightTheme ? `${css.GenreBadgesOfMovieLight}` : `${css.GenreBadgesOfMovieDark}`}`}>
            {genres.map(genre => <button onClick={() => getGenreMovies(genre.id)}>{genre.name}</button>)}
        </div>
    );
};

export {GenreBadgesOfMovie};