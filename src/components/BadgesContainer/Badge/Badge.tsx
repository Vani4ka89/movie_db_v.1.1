import {FC, PropsWithChildren} from 'react';
import {useNavigate} from "react-router-dom";

import {IGenreBadge} from "../../../interfaces";
import css from './Badge.module.css';
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {moviesActions} from "../../../store";


interface IProps extends PropsWithChildren {
    badge: IGenreBadge;
}

const Badge: FC<IProps> = ({badge}) => {
    const {id, name} = badge;
    const navigate = useNavigate();
    const {lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();

    const getGenreMovies = () => {
        navigate(`/movies/genre/${id}`);
        dispatch(moviesActions.setSearchTerm(''));
    };

    return (
        <div key={id} className={`${lightTheme ? `${css.btnBoxLight}` : `${css.btnBoxDark}`}`}>
            <button onClick={getGenreMovies}>{name}</button>
        </div>
    );
};

export {Badge};