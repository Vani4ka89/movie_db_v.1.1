import React, {FC} from 'react';
import {useSearchParams} from "react-router-dom";

import css from './Pagination.module.css';

const Pagination: FC = () => {

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
        <div className={css.Pagination}>
            <button style={{display: page <= 1 ? "none" : "block"}}
                    onClick={prevPage}>
                prev
            </button>
            <button className="page-link"
                    style={{display: page >= 500 ? "none" : "block"}}>
                {page}
            </button>
            <button className="page-link"
                    style={{display: page >= 500 ? "none" : "block"}}
                    onClick={nextPage}>
                {page + 1}
            </button>
            <button className="page-link"
                    style={{display: page >= 499 ? "none" : "block"}}
                    onClick={doubleNextPage}>
                {page + 2}
            </button>
            <button style={{display: page >= 500 ? "none" : "block"}}
                    onClick={nextPage}>
                next
            </button>
        </div>
    );
};

export {Pagination};