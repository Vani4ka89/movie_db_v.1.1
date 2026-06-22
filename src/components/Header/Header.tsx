import React, {ChangeEvent, FC, FormEvent, useId, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

import css from './Header.module.css';
import {useAppDispatch, useAppSelector} from "../../hooks";
import {moviesActions} from "../../store";

const Header: FC = () => {
    const navigate = useNavigate();
    const {searchTerm, lightTheme} = useAppSelector(state => state.movies);
    const dispatch = useAppDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navContentId = useId();

    const searchMovies = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        dispatch(moviesActions.setSearchTerm(value));
        if (value.trim()) {
            navigate('/movies/search?page=1', {replace: true});
        } else {
            navigate('/movies?page=1');
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
        navigate('/movies?page=1');
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const changeTheme = () => {
        dispatch(moviesActions.setLightTheme());
    };

    return (
        <header className={`${css.Header} ${lightTheme ? css.HeaderLight : css.HeaderDark}`}>
            <nav className={css.navbar}>
                <NavLink className={css.brand} to={'/movies'} onClick={doneScroll}>
                    <span className={css.brandMark} aria-hidden="true">
                        <span>M</span>
                        <span>D</span>
                        <span>B</span>
                    </span>
                    <span className={css.brandName}>
                        Movie<span>DB</span>
                    </span>
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

                <div className={css.headerActions}>
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
                </div>

                <div id={navContentId} className={`${css.navContent} ${isMenuOpen ? css.navContentOpen : ''}`}>
                    <NavLink
                        className={css.navBtn}
                        onClick={doneScroll}
                        to={'/movies'}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        className={css.navBtn}
                        onClick={doneScroll}
                        to={'/explore/movies/now-playing?page=1'}
                    >
                        Movies
                    </NavLink>
                    <NavLink
                        className={css.navBtn}
                        onClick={doneScroll}
                        to={'/explore/movies/popular?page=1'}
                    >
                        Explore
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export {Header};
