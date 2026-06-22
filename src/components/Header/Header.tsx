import React, {ChangeEvent, FC, FormEvent, useId, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

import css from './Header.module.css';
import logo from '../../assets/images/Logo.jpg';
import {useAppDispatch, useAppSelector} from "../../hooks";
import {moviesActions} from "../../store";

const Header: FC = () => {
    const navigate = useNavigate();
    const {searchTerm, lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navContentId = useId();

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

    const clearSearch = () => {
        dispatch(moviesActions.setSearchTerm(''));
        navigate('/movies');
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
                    aria-controls={navContentId}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div id={navContentId} className={`${css.navContent} ${isMenuOpen ? css.navContentOpen : ''}`}>
                    <NavLink
                        className={css.navBtn}
                        onClick={doneScroll}
                        aria-current="page"
                        to={'/movies'}
                    >
                        Movies
                    </NavLink>

                    <form className={css.searchForm} role="search" onSubmit={preventSearchSubmit}>
                        <SearchRoundedIcon className={css.searchIcon} aria-hidden="true"/>
                        <input
                            className={`${css.searchInput} ${searchTerm ? css.searchActive : ''}`}
                            type="search"
                            placeholder="Search movies"
                            aria-label="Search movies"
                            value={searchTerm || ''}
                            onChange={searchMovies}/>
                        {!!searchTerm && (
                            <button
                                className={css.clearSearchButton}
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                <CloseRoundedIcon fontSize="small"/>
                            </button>
                        )}
                    </form>

                    <button
                        className={`${css.themeButton} ${lightTheme ? css.themeLight : css.themeDark}`}
                        type="button"
                        onClick={changeTheme}
                        aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}
                    >
                        <span className={css.themeTrack} aria-hidden="true">
                            <span className={css.themeOption}><LightModeRoundedIcon fontSize="inherit"/></span>
                            <span className={css.themeOption}><DarkModeRoundedIcon fontSize="inherit"/></span>
                            <span className={css.themeKnob}>
                                {lightTheme ? <LightModeRoundedIcon fontSize="inherit"/> : <DarkModeRoundedIcon fontSize="inherit"/>}
                            </span>
                        </span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export {Header};
