import {FC, PropsWithChildren} from 'react';
import {Rating} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {IMovie} from "../../../interfaces";
import {posterBaseUrl} from "../../../constants";
import css from './MoviesListCard.module.css';
import {useAppSelector} from "../../../hooks";

interface IProps extends PropsWithChildren {
    movie: IMovie;
}

const MoviesListCard: FC<IProps> = ({movie}) => {
    const {id, title, poster_path, vote_average, release_date} = movie;

    const {lightTheme} = useAppSelector(state => state.movies);
    const navigate = useNavigate();

    const getMovieInfo = () => {
        navigate(`/movies/${id}`, {state: {...movie}});
    };

    if (!poster_path) {
        return null;
    }

    return (
        <article
            className={`${lightTheme ? `${css.MoviesListCardLight}` : `${css.MoviesListCardDark}`}`}
            onClick={getMovieInfo}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && getMovieInfo()}
        >
            <div className={css.imageBlock}>
                <img src={`${posterBaseUrl}${poster_path}`} alt={title}/>
            </div>
            <div className={css.cardBody}>
                <h5 className={`${lightTheme ? `${css.titleDark}` : `${css.titleLight}`}`}>{title}</h5>
                <div className={css.additionalData}>
                    <Rating className={css.rating}
                            name="read-only"
                            defaultValue={vote_average}
                            readOnly
                            max={10}
                            precision={0.5}
                            size='small'
                            style={{color: '#f59e0b', fontSize: '15px'}}
                    />
                    <div
                        className={`${lightTheme ? `${css.yearDark}` : `${css.yearLight}`}`}>{release_date?.substring(0, 4)}</div>
                </div>
            </div>
        </article>
    );
};

export {MoviesListCard};
