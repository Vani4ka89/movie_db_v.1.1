import {FC} from 'react';
import {Outlet} from "react-router-dom";

import {Footer, Header} from "../../components";
import css from './MainLayout.module.css';
import {useAppSelector} from "../../hooks";

const MainLayout: FC = () => {
    const {lightTheme} = useAppSelector(state => state.movies);

    return (
        <div className={`${lightTheme ? `${css.MainLayoutLight}` : `${css.MainLayoutDark}`}`}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export {MainLayout};