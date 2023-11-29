import {FC, PropsWithChildren} from 'react';
import {useNavigate} from "react-router-dom";

import {IGenreBadge} from "../../../interfaces";
import css from './Badge.module.css';
import {useAppDispatch} from "../../../hooks";
import {moviesActions} from "../../../store";


interface IProps extends PropsWithChildren {
    badge: IGenreBadge;
}

const Badge: FC<IProps> = ({badge}) => {
    const {id, name} = badge;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getGenreMovies = () => {
        navigate(`/movies/genre/${id}`);
        dispatch(moviesActions.setSearchTerm(''));
    };

    return (
        <div key={id} className={css.btnBox}>
            <button onClick={getGenreMovies}>{name}</button>
        </div>
    );
};

export {Badge};