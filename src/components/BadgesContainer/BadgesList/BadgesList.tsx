import {FC, useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {genresActions, moviesActions} from "../../../store";
import css from './BadgesList.module.css';

const BadgesList: FC = () => {

    const {badges} = useAppSelector(state => state.genres);
    const {lightTheme} = useAppSelector(state => state.movies);
    const {genreId} = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [draftGenreIds, setDraftGenreIds] = useState<number[]>([]);
    const drawerId = useId();
    const drawerTitleId = useId();
    const openButtonRef = useRef<HTMLButtonElement>(null);

    const selectedGenreIds = useMemo(() => {
        if (!genreId) {
            return [];
        }

        return genreId
            .split(',')
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0);
    }, [genreId]);

    const selectedGenreNames = useMemo(() => {
        return badges
            .filter(({id}) => selectedGenreIds.includes(id))
            .map(({name}) => name);
    }, [badges, selectedGenreIds]);

    const filterSummary = useMemo(() => {
        if (!selectedGenreNames.length) {
            return 'Filter by genre';
        }

        if (selectedGenreNames.length <= 2) {
            return selectedGenreNames.join(', ');
        }

        return `${selectedGenreNames.slice(0, 2).join(', ')} +${selectedGenreNames.length - 2}`;
    }, [selectedGenreNames]);

    useEffect(() => {
        dispatch(genresActions.getBadges());
    }, [dispatch]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                openButtonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const closeGenreMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleGenreMenu = useCallback(() => {
        setIsOpen(prevState => {
            if (!prevState) {
                setDraftGenreIds(selectedGenreIds);
            }

            return !prevState;
        });
    }, [selectedGenreIds]);

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
            .map(({id}) => id)
            .filter(id => draftGenreIds.includes(id));

        if (orderedGenreIds.length) {
            navigate(`/movies/genre/${orderedGenreIds.join(',')}`);
        } else {
            navigate('/movies');
        }

        dispatch(moviesActions.setSearchTerm(''));
        setIsOpen(false);
    }, [badges, dispatch, draftGenreIds, navigate]);

    return (
        <div className={`${css.BadgesList} ${lightTheme ? css.BadgesListLight : css.BadgesListDark}`}>
            <button
                ref={openButtonRef}
                type="button"
                className={css.filterButton}
                onClick={toggleGenreMenu}
                aria-expanded={isOpen}
                aria-controls={isOpen ? drawerId : undefined}
                disabled={!badges.length}
            >
                <span className={css.filterIcon} aria-hidden="true">
                    <span/>
                    <span/>
                    <span/>
                </span>
                <span className={css.filterButtonText}>
                    <span className={css.filterLabel}>Genres</span>
                    <span className={css.activeFilter}>{filterSummary}</span>
                </span>
                <span className={css.badgeCount}>
                    {selectedGenreIds.length || badges.length}
                </span>
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        tabIndex={-1}
                        className={css.overlay}
                        onClick={closeGenreMenu}
                        aria-label="Close genre filter"
                    />

                    <aside
                        id={drawerId}
                        className={`${css.drawer} ${lightTheme ? css.drawerLight : css.drawerDark}`}
                        aria-labelledby={drawerTitleId}
                    >
                        <div className={css.drawerHeader}>
                            <div>
                                <h2 id={drawerTitleId} className={css.drawerTitle}>Genres</h2>
                                <p className={css.drawerSubtitle}>Choose one or more genres</p>
                            </div>

                            <button
                                type="button"
                                className={css.closeButton}
                                onClick={closeGenreMenu}
                                aria-label="Close genre filter"
                            >
                                Close
                            </button>
                        </div>

                        <div className={css.selectionBar}>
                            <span className={css.selectionCount}>
                                {draftGenreIds.length ? `${draftGenreIds.length} selected` : 'No genres selected'}
                            </span>

                            {!!draftGenreIds.length && (
                                <div className={css.selectedPills} aria-label="Selected genres">
                                    {badges
                                        .filter(({id}) => draftGenreIds.includes(id))
                                        .slice(0, 3)
                                        .map(({id, name}) => (
                                            <span key={id} className={css.selectedPill}>{name}</span>
                                        ))}
                                    {draftGenreIds.length > 3 && (
                                        <span className={css.selectedPill}>+{draftGenreIds.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <ul className={css.genreList} aria-label="Genre options">
                            {badges.map(({id, name}) => {
                                const isSelected = draftGenreIds.includes(id);

                                return (
                                    <li key={id} className={css.genreItem}>
                                        <label className={`${css.genreOption} ${isSelected ? css.activeGenre : ''}`}>
                                            <input
                                                className={css.checkboxInput}
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleGenre(id)}
                                            />
                                            <span className={css.control} aria-hidden="true"/>
                                            <span className={css.genreName}>{name}</span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className={css.drawerFooter}>
                            <button
                                type="button"
                                className={css.clearButton}
                                onClick={clearGenres}
                                disabled={!draftGenreIds.length}
                            >
                                Clear
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
