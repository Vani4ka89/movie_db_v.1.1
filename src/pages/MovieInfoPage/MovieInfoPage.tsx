import {FC, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {EmptyState, Loading, MovieInfo} from "../../components";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useAppLocation} from "../../hooks/router.hooks";
import {IMovie} from "../../interfaces";
import {moviesActions} from "../../store";

const MovieInfoPage: FC = () => {
    const {movieId} = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {state: routeMovie} = useAppLocation<IMovie>();
    const {error, movie: storeMovie} = useAppSelector(state => state.movies);
    const numericMovieId = Number(movieId);
    const movie = routeMovie?.id === numericMovieId ? routeMovie : storeMovie?.id === numericMovieId ? storeMovie : null;

    useEffect(() => {
        dispatch(moviesActions.getById({movieId: numericMovieId}));
    }, [dispatch, numericMovieId]);

    return (
        <div>
            {movie && <MovieInfo key={movie.id} movie={movie}/>}
            {!movie && !error && <Loading/>}
            {!movie && error && (
                <EmptyState
                    title="Movie details are unavailable"
                    message="TMDB did not return this title. Browse the collection and try another movie."
                    actionLabel="Browse movies"
                    onAction={() => navigate('/movies')}
                />
            )}
        </div>
    );
};

export {MovieInfoPage};
