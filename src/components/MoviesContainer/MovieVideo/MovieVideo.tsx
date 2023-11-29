import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";

import {Video} from "../Video/Video";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";

const MovieVideo: FC = () => {
    const {movieId} = useParams<{ movieId: string }>();
    const {videos} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const trailers = videos.filter(trailer => trailer.type === 'Trailer');

    useEffect(() => {
        dispatch(moviesActions.getVideo({movieId: +movieId}))
    }, [movieId, dispatch]);

    return (
        <div>
            {trailers && trailers.map(trailer => <Video key={trailer.id} trailer={trailer}/>)}
        </div>
    );
};

export {MovieVideo};