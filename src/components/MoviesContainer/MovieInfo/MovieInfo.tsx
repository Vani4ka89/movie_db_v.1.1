import {FC} from 'react';
import {useNavigate} from "react-router-dom";
import {Rating} from "@mui/material";

import {useAppSelector} from "../../../hooks";
import css from './MovieInfo.module.css';
import {posterBaseUrl} from "../../../constants";
import {GenreBadgesOfMovie} from "../../BadgesContainer";
import {IMovie} from "../../../interfaces";

interface IProps {
    movie: IMovie;
}

const MovieInfo: FC<IProps> = ({movie}) => {
    const {id, poster_path, title, original_title, vote_average, overview} = movie;

    const lightTheme = useAppSelector(state => state.movies.lightTheme);
    const navigate = useNavigate();

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
                        className={css.rating}
                        name="read-only"
                        defaultValue={vote_average}
                        readOnly max={10}
                        precision={0.1}
                        size='large'
                        style={{color: '#ee5316'}}
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