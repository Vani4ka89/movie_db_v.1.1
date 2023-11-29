import {FC, useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import css from './MoviesFound.module.css';

const MoviesFound: FC = () => {

    const {searchTerm, movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [query,] = useSearchParams();

    const page = +query.get('page');

    useEffect(() => {
        dispatch(moviesActions.getFound({searchTerm, page}));
    }, [dispatch, page, searchTerm]);

    return (
        <div className={css.MoviesFound}>
            {movies.map(movie => <MoviesListCard key={movie.id} movie={movie}/>)}
        </div>
    );
};

export {MoviesFound};