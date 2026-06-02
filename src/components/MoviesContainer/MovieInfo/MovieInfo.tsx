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
            <div className={css.posterPanel}>
                <img src={`${posterBaseUrl}${poster_path}`} alt={title}/>
            </div>
            <div className={`${css.content} ${lightTheme ? css.contentLight : css.contentDark}`}>
                <h1 className={`${lightTheme ? `${css.titleDark}` : `${css.titleLight}`}`}>{original_title || title}</h1>
                <GenreBadgesOfMovie/>
                <p className={css.sectionLabel}>Rating</p>
                <div className={css.ratingBlock}>
                    <Rating
                        className={css.rating}
                        name="read-only"
                        defaultValue={vote_average}
                        readOnly max={10}
                        precision={0.1}
                        size='large'
                        style={{color: '#f59e0b'}}
                    />
                </div>
                <p className={css.sectionLabel}>Overview</p>
                <h5>{overview}</h5>
                <button className={css.btnPlay} onClick={getMovieVideos}>Play trailer</button>
            </div>
        </div>
    );
};

export {MovieInfo};
