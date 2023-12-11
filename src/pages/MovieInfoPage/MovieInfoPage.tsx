import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";

import {Loading, MovieInfo} from "../../components";
import {useAppDispatch} from "../../hooks";
import {useAppLocation} from "../../hooks/router.hooks";
import {IMovie} from "../../interfaces";
import {moviesActions} from "../../store";

const MovieInfoPage: FC = () => {
    const {movieId} = useParams();
    const dispatch = useAppDispatch();
    const {state: movie} = useAppLocation<IMovie>();

    useEffect(() => {
        dispatch(moviesActions.getById({movieId: +movieId}));
    }, [dispatch, movieId]);

    return (
        <div>
            {movie ? <MovieInfo key={movie.id} movie={movie}/> : <Loading/>}
        </div>
    );
};

export {MovieInfoPage};