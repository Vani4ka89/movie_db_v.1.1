import {FC, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import css from './MoviesOfGenre.module.css';
import {Loading} from "../../Loading/Loading";
import {EmptyState} from "../../EmptyState/EmptyState";
import {IMovie} from "../../../interfaces";

const MoviesOfGenre: FC = () => {

    const {genreId} = useParams();
    const {error, loading, movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [query,] = useSearchParams();

    const page = Math.max(1, Number(query.get('page')) || 1);
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

    const clearFilters = () => {
        dispatch(moviesActions.setSearchTerm(''));
        navigate('/movies');
    };

    return (
        <div className={css.MoviesOfGenre}>
            {loading && <Loading/>}
            {!loading && error && (
                <EmptyState
                    title="Genre collection is unavailable"
                    message="TMDB did not respond for these filters. Try clearing them or check back in a moment."
                    actionLabel="Clear filters"
                    onAction={clearFilters}
                />
            )}
            {!loading && !error && !movies.length && (
                <EmptyState
                    title="No movies in this selection"
                    message="This genre combination returned no titles. Clear the filters or try a broader mix."
                    actionLabel="Clear filters"
                    onAction={clearFilters}
                />
            )}
            {!loading && !error && movies.map((movie: IMovie, index: number) => (
                <MoviesListCard key={movie.id} movie={movie} index={index}/>
            ))}
        </div>
    );
};

export {MoviesOfGenre};
