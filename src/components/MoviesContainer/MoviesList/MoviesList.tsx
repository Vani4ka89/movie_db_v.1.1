import {FC, useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import css from './MoviesList.module.css';

const MoviesList: FC = () => {
    const {movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [query,] = useSearchParams({page: '1'});

    const page = +query.get('page');

    useEffect(() => {
        dispatch(moviesActions.getAll({page}));
    }, [dispatch, page]);

    return (
        <div className={css.MoviesList}>
            {movies.map(movie => <MoviesListCard key={movie.id} movie={movie}/>)}
        </div>
    );
};

export {MoviesList};