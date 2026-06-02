import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";

import css from './Header.module.css';
import logo from '../../assets/images/Logo.jpg';
import sun from '../../assets/images/free-icon-sun-5247953.png';
import moon from '../../assets/images/free-icon-moon-3599494.png';
import {useAppDispatch, useAppSelector} from "../../hooks";
import {moviesActions} from "../../store";

const Header: FC = () => {
    const navigate = useNavigate();
    const {searchTerm, lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const searchMovies = (e: ChangeEvent<HTMLInputElement>) => {
        (dispatch(moviesActions.setSearchTerm(e.target.value)));
        if (e.target.value) {
            navigate('/movies/search');
        } else {
            navigate('/movies');
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const preventSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const doneScroll = () => {
        dispatch(moviesActions.setSearchTerm(''));
        setIsMenuOpen(false);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const changeTheme = () => {
        dispatch(moviesActions.setLightTheme());
    };

    return (
        <header className={`${css.Header} ${lightTheme ? css.HeaderLight : css.HeaderDark}`}>
            <nav className={css.navbar}>
                <NavLink className={css.brand} to={'/movies'} onClick={doneScroll}>
                    <img src={logo} alt="Movie DB logo"/>
                    <span>Movie DB</span>
                </NavLink>

                <button
                    className={`${css.menuButton} ${isMenuOpen ? css.menuButtonOpen : ''}`}
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`${css.navContent} ${isMenuOpen ? css.navContentOpen : ''}`}>
                    <NavLink
                        className={`${css.navBtn} ${lightTheme ? css.navBtnLight : css.navBtnDark}`}
                        onClick={doneScroll}
                        aria-current="page"
                        to={'/movies'}
                    >
                        Movies
                    </NavLink>

                    <form className={css.searchForm} role="search" onSubmit={preventSearchSubmit}>
                        <input
                            className={`${css.searchInput} ${lightTheme ? css.searchLight : css.searchDark}`}
                            type="search"
                            placeholder="Search movies"
                            aria-label="Search movies"
                            value={searchTerm || ''}
                            onChange={searchMovies}/>
                    </form>

                    <button className={css.themeButton} type="button" onClick={changeTheme}
                            aria-label="Change color theme">
                        <img className={css.themeImg} src={lightTheme ? moon : sun} alt=""/>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export {Header};
