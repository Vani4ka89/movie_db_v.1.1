import {CSSProperties, FC, PropsWithChildren} from 'react';
import {Rating} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {IMovie} from "../../../interfaces";
import {posterBaseUrl} from "../../../constants";
import css from './MoviesListCard.module.css';
import {useAppSelector} from "../../../hooks";

interface IProps extends PropsWithChildren {
    movie: IMovie;
    index?: number;
}

const MoviesListCard: FC<IProps> = ({movie, index = 0}) => {
    const {backdrop_path, id, original_title, poster_path, title, vote_average, release_date} = movie;

    const {lightTheme} = useAppSelector(state => state.movies);
    const navigate = useNavigate();
    const imagePath = poster_path || backdrop_path;
    const displayTitle = title || original_title || 'Untitled movie';
    const year = release_date?.substring(0, 4) || 'TBA';
    const ratingValue = Number((vote_average / 2).toFixed(1));
    const ratingLabel = vote_average ? vote_average.toFixed(1) : 'NR';
    const cardStyle = {
        animationDelay: `${Math.min(index, 18) * 44}ms`
    } as CSSProperties;

    const getMovieInfo = () => {
        navigate(`/movies/${id}`, {state: {...movie}});
    };

    return (
        <article
            className={`${lightTheme ? `${css.MoviesListCardLight}` : `${css.MoviesListCardDark}`}`}
            style={cardStyle}
            onClick={getMovieInfo}
            tabIndex={0}
            role="button"
            aria-label={`Open details for ${displayTitle}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    getMovieInfo();
                }
            }}
        >
            <div className={css.imageBlock}>
                {imagePath ? (
                    <img
                        src={`${posterBaseUrl}${imagePath}`}
                        alt={displayTitle}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className={css.posterFallback} aria-hidden="true">
                        <span>{displayTitle.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className={css.cardBody}>
                <h5>{displayTitle}</h5>
                <div className={css.additionalData}>
                    <div className={css.ratingWrap} aria-label={`Rating ${ratingLabel} out of 10`}>
                        <span className={css.ratingScore}>{ratingLabel}</span>
                        <Rating className={css.rating}
                                name={`rating-${id}`}
                                value={ratingValue}
                                readOnly
                                max={5}
                                precision={0.5}
                                size='small'
                    />
                    </div>
                    <div className={css.year}>{year}</div>
                </div>
            </div>
        </article>
    );
};

export {MoviesListCard};
