import {CSSProperties, FC} from 'react';
import {useNavigate} from "react-router-dom";
import {Rating} from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import {useAppSelector} from "../../../hooks";
import css from './MovieInfo.module.css';
import {backdropBaseUrl, posterBaseUrl} from "../../../constants";
import {GenreBadgesOfMovie} from "../../BadgesContainer";
import {IMovie} from "../../../interfaces";

interface IProps {
    movie: IMovie;
}

const MovieInfo: FC<IProps> = ({movie}) => {
    const {backdrop_path, id, poster_path, release_date, title, original_title, vote_average, overview} = movie;

    const lightTheme = useAppSelector(state => state.movies.lightTheme);
    const navigate = useNavigate();
    const displayTitle = original_title || title || 'Untitled movie';
    const releaseYear = release_date?.substring(0, 4);
    const backdropStyle = {
        '--movie-backdrop': backdrop_path ? `url(${backdropBaseUrl}${backdrop_path})` : 'none'
    } as CSSProperties;

    const getMovieVideos = () => {
        navigate(`/movies/${id}/video`);
    };

    return (
        <div className={`${css.MovieInfo} ${!backdrop_path ? css.noBackdrop : ''}`} style={backdropStyle}>
            <div className={css.posterPanel}>
                {poster_path ? (
                    <img src={`${posterBaseUrl}${poster_path}`} alt={displayTitle}/>
                ) : (
                    <div className={css.posterFallback} aria-hidden="true">
                        <span>{displayTitle.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className={`${css.content} ${lightTheme ? css.contentLight : css.contentDark}`}>
                {releaseYear && <p className={css.kicker}>{releaseYear}</p>}
                <h1>{displayTitle}</h1>
                <div className={css.genreShell}>
                    <GenreBadgesOfMovie/>
                </div>
                <div className={css.ratingBlock} aria-label={`Rating ${vote_average?.toFixed(1) || 'not rated'} out of 10`}>
                    <span className={css.ratingNumber}>{vote_average ? vote_average.toFixed(1) : 'NR'}</span>
                    <div className={css.ratingStars}>
                        <Rating
                            className={css.rating}
                            name="read-only"
                            value={vote_average ? vote_average / 2 : 0}
                            readOnly max={5}
                            precision={0.1}
                            size='large'
                        />
                        <span>TMDB rating</span>
                    </div>
                </div>
                <div className={css.overviewBlock}>
                    <p className={css.sectionLabel}>Overview</p>
                    <p>{overview || 'No overview is available for this title yet.'}</p>
                </div>
                <button className={css.btnPlay} onClick={getMovieVideos}>
                    <PlayArrowRoundedIcon fontSize="small"/>
                    <span>Play trailer</span>
                </button>
            </div>
        </div>
    );
};

export {MovieInfo};
