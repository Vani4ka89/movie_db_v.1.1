import {FC, useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import {getTmdbExplorePath, tmdbMenu} from "../../../constants";
import {IGenreBadge, ITmdbMenuItem} from "../../../interfaces";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {genresActions, moviesActions} from "../../../store";
import css from './BadgesList.module.css';

const BadgesList: FC = () => {
    const {badges} = useAppSelector(state => state.genres);
    const {lightTheme} = useAppSelector(state => state.movies);
    const {genreId} = useParams();
    const {pathname} = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [menuQuery, setMenuQuery] = useState('');
    const [draftGenreIds, setDraftGenreIds] = useState<number[]>([]);
    const drawerId = useId();
    const drawerTitleId = useId();
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLElement>(null);

    const selectedGenreIds = useMemo(() => {
        if (!genreId || !pathname.startsWith('/movies/genre')) {
            return [];
        }

        return genreId
            .split(',')
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0);
    }, [genreId, pathname]);

    const selectedGenreNames = useMemo(() => {
        return badges
            .filter((badge: IGenreBadge) => selectedGenreIds.includes(badge.id))
            .map((badge: IGenreBadge) => badge.name);
    }, [badges, selectedGenreIds]);

    const filterSummary = useMemo(() => {
        if (!selectedGenreNames.length) {
            return 'Explore TMDB API';
        }

        if (selectedGenreNames.length <= 2) {
            return selectedGenreNames.join(', ');
        }

        return `${selectedGenreNames.slice(0, 2).join(', ')} +${selectedGenreNames.length - 2}`;
    }, [selectedGenreNames]);

    const filteredMenu = useMemo(() => {
        const normalizedQuery = menuQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return tmdbMenu;
        }

        return tmdbMenu.filter(item => {
            const searchable = `${item.group} ${item.label} ${item.description} ${item.section} ${item.endpoint}`.toLowerCase();
            return searchable.includes(normalizedQuery);
        });
    }, [menuQuery]);

    const menuGroups = useMemo(() => {
        return filteredMenu.reduce<Record<string, ITmdbMenuItem[]>>((groups, item) => {
            if (!groups[item.group]) {
                groups[item.group] = [];
            }

            groups[item.group].push(item);
            return groups;
        }, {});
    }, [filteredMenu]);

    const activeMenuItem = useMemo(() => {
        return tmdbMenu.find(item => pathname === `/explore/${item.section}/${item.endpoint}`);
    }, [pathname]);

    useEffect(() => {
        dispatch(genresActions.getBadges());
    }, [dispatch]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                openButtonRef.current?.focus();
            }

            if (event.key !== 'Tab') {
                return;
            }

            const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements?.length) {
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        const focusTimer = window.setTimeout(() => {
            const firstInteractive = drawerRef.current?.querySelector<HTMLElement>(
                'button:not([disabled]), input:not([disabled])'
            );
            firstInteractive?.focus();
        }, 0);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        window.setTimeout(() => openButtonRef.current?.focus(), 0);
    }, []);

    const toggleMenu = useCallback(() => {
        setIsOpen(prevState => {
            if (!prevState) {
                setDraftGenreIds(selectedGenreIds);
            }

            return !prevState;
        });
    }, [selectedGenreIds]);

    const openMenuItem = useCallback((item: ITmdbMenuItem) => {
        const target = getTmdbExplorePath(item);
        navigate(target);
        dispatch(moviesActions.setSearchTerm(''));
        setIsOpen(false);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [dispatch, navigate]);

    const toggleGenre = useCallback((id: number) => {
        setDraftGenreIds(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(genreId => genreId !== id);
            }

            return [...prevState, id];
        });
    }, []);

    const clearGenres = useCallback(() => {
        setDraftGenreIds([]);
    }, []);

    const applyGenres = useCallback(() => {
        const orderedGenreIds = badges
            .map((badge: IGenreBadge) => badge.id)
            .filter((id: number) => draftGenreIds.includes(id));

        if (orderedGenreIds.length) {
            navigate(`/movies/genre/${orderedGenreIds.join(',')}?page=1`);
        } else {
            navigate('/movies?page=1');
        }

        dispatch(moviesActions.setSearchTerm(''));
        setIsOpen(false);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [badges, dispatch, draftGenreIds, navigate]);

    return (
        <div className={css.BadgesList}>
            <button
                ref={openButtonRef}
                type="button"
                className={`${css.filterButton} ${isOpen ? css.filterButtonOpen : ''}`}
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-controls={isOpen ? drawerId : undefined}
            >
                <span className={css.filterIcon} aria-hidden="true">
                    <TuneRoundedIcon fontSize="small"/>
                </span>
                <span className={css.filterButtonText}>
                    <span className={css.filterLabel}>{activeMenuItem?.group || 'TMDB API'}</span>
                    <span className={css.activeFilter}>{activeMenuItem?.label || filterSummary}</span>
                </span>
                <span className={css.badgeCount}>
                    {selectedGenreIds.length || tmdbMenu.length}
                </span>
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        tabIndex={-1}
                        className={css.overlay}
                        onClick={closeMenu}
                        aria-label="Close API menu"
                    />

                    <aside
                        ref={drawerRef}
                        id={drawerId}
                        className={`${css.drawer} ${lightTheme ? css.drawerLight : css.drawerDark}`}
                        aria-labelledby={drawerTitleId}
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className={css.drawerHeader}>
                            <div>
                                <h2 id={drawerTitleId} className={css.drawerTitle}>TMDB API</h2>
                                <p className={css.drawerSubtitle}>Read-only discovery, search, metadata and configuration.</p>
                            </div>

                            <button
                                type="button"
                                className={css.closeButton}
                                onClick={closeMenu}
                                aria-label="Close API menu"
                            >
                                <CloseRoundedIcon fontSize="small"/>
                            </button>
                        </div>

                        <div className={css.searchBox}>
                            <SearchRoundedIcon className={css.searchIcon} aria-hidden="true"/>
                            <input
                                value={menuQuery}
                                onChange={event => setMenuQuery(event.target.value)}
                                placeholder="Search API menu"
                                aria-label="Search API menu"
                                type="search"
                            />
                            {!!menuQuery && (
                                <button type="button" onClick={() => setMenuQuery('')} aria-label="Clear API menu search">
                                    <CloseRoundedIcon fontSize="small"/>
                                </button>
                            )}
                        </div>

                        <div className={css.menuScroller}>
                            {Object.entries(menuGroups).map(([group, items]) => (
                                <section key={group} className={css.menuGroup}>
                                    <div className={css.menuGroupHeader}>
                                        <h3>{group}</h3>
                                        <span>{items.length}</span>
                                    </div>
                                    <div className={css.menuItems}>
                                        {items.map(item => {
                                            const isActive = pathname === `/explore/${item.section}/${item.endpoint}`;

                                            return (
                                                <button
                                                    key={`${item.section}-${item.endpoint}`}
                                                    type="button"
                                                    className={`${css.menuItem} ${isActive ? css.activeMenuItem : ''}`}
                                                    onClick={() => openMenuItem(item)}
                                                    aria-current={isActive ? 'page' : undefined}
                                                >
                                                    <span className={css.menuCopy}>
                                                        <strong>{item.label}</strong>
                                                        <small>{item.description}</small>
                                                    </span>
                                                    <span className={css.menuMeta}>{item.badge}</span>
                                                    <ChevronRightRoundedIcon className={css.chevron} fontSize="small"/>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}

                            {!filteredMenu.length && (
                                <p className={css.noResults}>No API menu items match this search.</p>
                            )}

                            <section className={css.genreFilter}>
                                <div className={css.menuGroupHeader}>
                                    <h3>Movie Genre Filter</h3>
                                    <span>{draftGenreIds.length || badges.length}</span>
                                </div>

                                <p className={css.genreHint}>This keeps the original multi-genre movie flow.</p>

                                <div className={css.selectionBar}>
                                    <span className={css.selectionCount}>
                                        {draftGenreIds.length ? `${draftGenreIds.length} selected` : 'No genres selected'}
                                    </span>

                                    {!!draftGenreIds.length && (
                                        <div className={css.selectedPills} aria-label="Selected genres">
                                            {badges
                                                .filter((badge: IGenreBadge) => draftGenreIds.includes(badge.id))
                                                .slice(0, 3)
                                                .map((badge: IGenreBadge) => (
                                                    <span key={badge.id} className={css.selectedPill}>{badge.name}</span>
                                                ))}
                                            {draftGenreIds.length > 3 && (
                                                <span className={css.selectedPill}>+{draftGenreIds.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <ul className={css.genreList} aria-label="Movie genre options">
                                    {badges.map((badge: IGenreBadge, index: number) => {
                                        const isSelected = draftGenreIds.includes(badge.id);

                                        return (
                                            <li
                                                key={badge.id}
                                                className={css.genreItem}
                                                style={{animationDelay: `${Math.min(index, 24) * 18}ms`}}
                                            >
                                                <label className={`${css.genreOption} ${isSelected ? css.activeGenre : ''}`}>
                                                    <input
                                                        className={css.checkboxInput}
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleGenre(badge.id)}
                                                    />
                                                    <span className={css.control} aria-hidden="true"/>
                                                    <span className={css.genreName}>{badge.name}</span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        </div>

                        <div className={css.drawerFooter}>
                            <button
                                type="button"
                                className={css.clearButton}
                                onClick={clearGenres}
                                disabled={!draftGenreIds.length}
                            >
                                Clear genres
                            </button>

                            <button
                                type="button"
                                className={css.applyButton}
                                onClick={applyGenres}
                            >
                                Show movies
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </div>
    );
};

export {BadgesList};
