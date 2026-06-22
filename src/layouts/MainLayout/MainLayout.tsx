import {FC, useEffect, useLayoutEffect} from 'react';
import {Outlet, useLocation} from "react-router-dom";

import {Footer, Header} from "../../components";
import css from './MainLayout.module.css';
import {useAppSelector} from "../../hooks";

const MainLayout: FC = () => {
    const {lightTheme} = useAppSelector(state => state.movies);
    const {pathname} = useLocation();

    useEffect(() => {
        if (!('scrollRestoration' in window.history)) {
            return;
        }

        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';

        return () => {
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return (
        <div className={`${css.MainLayout} ${lightTheme ? css.MainLayoutLight : css.MainLayoutDark}`}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export {MainLayout};
