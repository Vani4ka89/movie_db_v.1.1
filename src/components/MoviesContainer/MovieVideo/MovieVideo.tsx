import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";

import {Video} from "../Video/Video";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import css from './MovieVideo.module.css';

const MovieVideo: FC = () => {
    const {movieId} = useParams<{ movieId: string }>();
    const {videos} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const trailers = videos.filter(trailer => trailer.type === 'Trailer');

    useEffect(() => {
        dispatch(moviesActions.getVideo({movieId: +movieId}))
    }, [movieId, dispatch]);

    return (
        <div className={css.MovieVideo}>
            {trailers && trailers.map(trailer => <Video key={trailer.id} trailer={trailer}/>)}
        </div>
    );
};

export {MovieVideo};
