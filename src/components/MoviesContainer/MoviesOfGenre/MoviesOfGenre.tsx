import {FC, useEffect} from 'react';
import {useParams, useSearchParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import css from './MoviesOfGenre.module.css';

const MoviesOfGenre: FC = () => {

    const {genreId} = useParams();
    const {movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [query,] = useSearchParams();

    const page = +query.get('page');
    const genreIds = genreId
        ?.split(',')
        .map(id => Number(id))
        .filter(id => Number.isFinite(id) && id > 0)
        .join(',');

    useEffect(() => {
        if (genreIds) {
            dispatch(moviesActions.getOfGenre({genreId: genreIds, page}));
        }
    }, [page, dispatch, genreIds]);

    return (
        <div className={css.MoviesOfGenre}>
            {movies.map(movie => <MoviesListCard key={movie.id} movie={movie}/>)}
        </div>
    );
};

export {MoviesOfGenre};
