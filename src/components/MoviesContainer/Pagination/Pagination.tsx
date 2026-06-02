import React, {FC} from 'react';
import {useSearchParams} from "react-router-dom";

import css from './Pagination.module.css';
import {useAppSelector} from "../../../hooks";

const Pagination: FC = () => {

    const {lightTheme} = useAppSelector(state => state.movies);
    const [query, setQuery] = useSearchParams();
    const page = +query.get('page') ? +query.get('page') : 1;

    const prevPage = () => {
        if (page <= 1) {
            return
        }
        setQuery({page: `${page - 1}`});
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const nextPage = () => {
        if (page >= 501) {
            return
        }
        setQuery({page: `${page + 1}`});
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const doubleNextPage = () => {
        setQuery({page: `${page + 2}`});
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <div className={`${lightTheme ? `${css.PaginationLight}` : `${css.PaginationDark}`}`}>
            {page > 1 && <button className={css.navButton}
                    aria-label="Previous page"
                    onClick={prevPage}>
                ‹
            </button>}
            {page < 500 && <button className={css.currentPage}
                    type="button"
                    aria-current="page">
                {page}
            </button>}
            {page < 500 && <button className={css.pageButton}
                    onClick={nextPage}>
                {page + 1}
            </button>}
            {page < 499 && <button className={css.pageButton}
                    onClick={doubleNextPage}>
                {page + 2}
            </button>}
            {page < 500 && <button className={css.navButton}
                    aria-label="Next page"
                    onClick={nextPage}>
                ›
            </button>}
        </div>
    );
};

export {Pagination};
