import {FC, useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import css from './MoviesList.module.css';
import {Loading} from "../../Loading/Loading";
import {EmptyState} from "../../EmptyState/EmptyState";

const MoviesList: FC = () => {
    const {error, loading, movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [query,] = useSearchParams({page: '1'});

    const page = +query.get('page');

    useEffect(() => {
        dispatch(moviesActions.getAll({page}));
    }, [dispatch, page]);

    return (
        <div className={css.MoviesList}>
            {loading && <Loading/>}
            {!loading && error && (
                <EmptyState
                    title="The collection is unavailable"
                    message="TMDB did not respond. Check your connection and try again in a moment."
                />
            )}
            {!loading && !error && !movies.length && (
                <EmptyState
                    title="No movies found"
                    message="The current collection returned no titles. Try another page or adjust your filters."
                />
            )}
            {!loading && !error && movies.map((movie, index) => (
                <MoviesListCard key={movie.id} movie={movie} index={index}/>
            ))}
        </div>
    );
};

export {MoviesList};
