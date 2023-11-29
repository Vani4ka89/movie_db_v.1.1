import {FC, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Rating} from "@mui/material";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";
import {Loading} from "../../Loading/Loading";
import css from './MovieInfo.module.css';
import {posterBaseUrl} from "../../../constants";
import {GenreBadgesOfMovie} from "../../BadgesContainer";


const MovieInfo: FC = () => {

    const {movieId} = useParams<{ movieId: string }>();
    const dispatch = useAppDispatch();
    const {movie, lightTheme} = useAppSelector(state => state.movies);
    const navigate = useNavigate();

    useEffect(() => {
        if (movieId) {
            dispatch(moviesActions.getById({movieId: +movieId}));
        }
    }, [dispatch, movieId]);

    if (!movie) {
        return <Loading/>
    }

    const {id, poster_path, title, original_title, vote_average, overview} = movie;

    const getMovieVideos = () => {
        navigate(`/movies/${id}/video`);
    };

    return (
        <div className={css.MovieInfo}>
            <div>
                <img src={`${posterBaseUrl}${poster_path}`} alt={title}/>
            </div>
            <div className={css.content}>
                <h1 className={`${lightTheme ? `${css.titleDark}` : `${css.titleLight}`}`}>{original_title}</h1>
                <GenreBadgesOfMovie/>
                <p>Rating</p>
                <div>
                    <Rating
                        name="read-only"
                        defaultValue={vote_average}
                        readOnly max={10}
                        precision={0.1}
                        size='large'
                    />
                </div>
                <p>Overview</p>
                <h5>{overview}</h5>
                <button className={css.btnPlay} onClick={getMovieVideos}>PLAY</button>
            </div>
        </div>
    );
};

export {MovieInfo};