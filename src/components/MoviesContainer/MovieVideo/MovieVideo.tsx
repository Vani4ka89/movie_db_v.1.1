import {FC, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {Video} from "../Video/Video";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import css from './MovieVideo.module.css';
import {Loading} from "../../Loading/Loading";
import {EmptyState} from "../../EmptyState/EmptyState";

const MovieVideo: FC = () => {
    const {movieId} = useParams<{ movieId: string }>();
    const {error, loading, videos} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const trailers = videos.filter(trailer => trailer.type === 'Trailer');

    useEffect(() => {
        dispatch(moviesActions.getVideo({movieId: +movieId}))
    }, [movieId, dispatch]);

    return (
        <div className={css.MovieVideo}>
            {loading && <Loading/>}
            {!loading && error && (
                <EmptyState
                    title="Trailer is unavailable"
                    message="TMDB did not respond with videos for this movie. Return to the movie and try again later."
                    actionLabel="Back to movie"
                    onAction={() => navigate(`/movies/${movieId}`)}
                />
            )}
            {!loading && !error && !trailers.length && (
                <EmptyState
                    title="No trailer found"
                    message="There is no official trailer attached to this title yet."
                    actionLabel="Back to movie"
                    onAction={() => navigate(`/movies/${movieId}`)}
                />
            )}
            {!loading && !error && trailers.map(trailer => <Video key={trailer.id} trailer={trailer}/>)}
        </div>
    );
};

export {MovieVideo};
