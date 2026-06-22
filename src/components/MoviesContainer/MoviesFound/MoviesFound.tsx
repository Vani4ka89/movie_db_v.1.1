import {FC, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import {MoviesListCard} from "../MoviesListCard/MoviesListCard";
import css from './MoviesFound.module.css';
import {Loading} from "../../Loading/Loading";
import {EmptyState} from "../../EmptyState/EmptyState";

const MoviesFound: FC = () => {

    const {error, loading, searchTerm, movies} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [query,] = useSearchParams();

    const page = Math.max(1, Number(query.get('page')) || 1);

    useEffect(() => {
        if (!String(searchTerm || '').trim()) {
            navigate('/movies?page=1', {replace: true});
            return;
        }

        dispatch(moviesActions.getFound({searchTerm, page}));
    }, [dispatch, navigate, page, searchTerm]);

    const browseMovies = () => {
        dispatch(moviesActions.setSearchTerm(''));
        navigate('/movies');
    };

    return (
        <div className={css.MoviesFound}>
            {loading && <Loading/>}
            {!loading && error && (
                <EmptyState
                    title="Search is unavailable"
                    message="TMDB did not respond to this search. Try again in a moment."
                    actionLabel="Browse movies"
                    onAction={browseMovies}
                />
            )}
            {!loading && !error && !movies.length && (
                <EmptyState
                    title="No matches"
                    message={`Nothing matched "${searchTerm || 'your search'}". Try a different title or browse the full collection.`}
                    actionLabel="Browse movies"
                    onAction={browseMovies}
                />
            )}
            {!loading && !error && movies.map((movie, index) => (
                <MoviesListCard key={movie.id} movie={movie} index={index}/>
            ))}
        </div>
    );
};

export {MoviesFound};
