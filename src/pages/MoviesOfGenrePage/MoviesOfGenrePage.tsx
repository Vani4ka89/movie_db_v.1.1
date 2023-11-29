import {FC, useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {BadgesList, Pagination, MoviesOfGenre} from "../../components";
import css from './MoviesOfGenrePage.module.css';

const MoviesOfGenrePage: FC = () => {

    const [query, setQuery] = useSearchParams();
    const page = query.get('page');

    useEffect(() => {
        if (!page) {
            setQuery({page: '1'})
        }
    }, [page, setQuery]);

    return (
        <div className={css.MoviesOfGenrePage}>
            <BadgesList/>
            <MoviesOfGenre/>
            <Pagination/>
        </div>
    );
};

export {MoviesOfGenrePage};