import {FC, useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {MoviesList, Pagination} from "../../components";

const MoviesPage: FC = () => {

    const [query, setQuery] = useSearchParams();

    const page = query.get('page');

    useEffect(() => {
        if (!page) {
            setQuery({page: '1'});
        }
    }, [page, setQuery]);

    return (
        <div>
            <MoviesList/>
            <Pagination/>
        </div>
    );
};

export {MoviesPage};