import {ChangeEvent, FC, FormEvent, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {BadgesList, EmptyState, Loading, TmdbMediaCard} from "../../components";
import {getTmdbMenuItem} from "../../constants";
import {TmdbExploreItem} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {tmdbActions} from "../../store";
import css from './ExplorePage.module.css';

const ExplorePage: FC = () => {
    const {section, endpoint} = useParams<{ section: string; endpoint: string }>();
    const [queryParams, setQueryParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {error, items, loading, totalPages, totalResults} = useAppSelector(state => state.tmdb);
    const page = Math.max(1, Number(queryParams.get('page')) || 1);
    const queryValue = queryParams.get('query') || '';
    const sourceValue = queryParams.get('source') || 'imdb_id';
    const [draftQuery, setDraftQuery] = useState(queryValue);
    const externalSources = useMemo(() => [
        {value: 'imdb_id', label: 'IMDb'},
        {value: 'tvdb_id', label: 'TVDB'},
        {value: 'wikidata_id', label: 'Wikidata'},
        {value: 'facebook_id', label: 'Facebook'},
        {value: 'instagram_id', label: 'Instagram'},
        {value: 'twitter_id', label: 'Twitter'}
    ], []);

    const menuItem = useMemo(() => {
        if (!section || !endpoint) {
            return undefined;
        }

        return getTmdbMenuItem(section, endpoint);
    }, [endpoint, section]);

    useEffect(() => {
        setDraftQuery(queryValue);
    }, [queryValue, section, endpoint]);

    useEffect(() => {
        if (!menuItem?.requiresQuery) {
            return;
        }

        const timer = window.setTimeout(() => {
            const nextQuery = draftQuery.trim();
            const currentQuery = queryParams.get('query') || '';

            if (nextQuery === currentQuery) {
                return;
            }

            const nextParams: Record<string, string> = {page: '1'};

            if (nextQuery) {
                nextParams.query = nextQuery;
            }

            if (menuItem.kind === 'find') {
                nextParams.source = sourceValue;
            }

            setQueryParams(nextParams, {replace: true});
        }, 420);

        return () => window.clearTimeout(timer);
    }, [draftQuery, menuItem?.kind, menuItem?.requiresQuery, queryParams, setQueryParams, sourceValue]);

    useEffect(() => {
        if (!menuItem || !section || !endpoint) {
            return;
        }

        const promise = dispatch(tmdbActions.getExplore({
            section,
            endpoint,
            page,
            query: queryValue,
            source: sourceValue
        }));

        return () => {
            promise.abort();
        };
    }, [dispatch, endpoint, menuItem, page, queryValue, section, sourceValue]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDraftQuery(event.target.value);
    };

    const clearSearch = () => {
        setDraftQuery('');
        const params: Record<string, string> = {page: '1'};

        if (menuItem?.kind === 'find') {
            params.source = sourceValue;
        }

        setQueryParams(params, {replace: true});
    };

    const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const goToFirstPage = () => {
        const params: Record<string, string> = {page: '1'};

        if (queryValue) {
            params.query = queryValue;
        }

        if (menuItem?.kind === 'find') {
            params.source = sourceValue;
        }

        setQueryParams(params);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const changePage = (nextPage: number) => {
        const params: Record<string, string> = {page: `${nextPage}`};

        if (queryValue) {
            params.query = queryValue;
        }

        if (menuItem?.kind === 'find') {
            params.source = sourceValue;
        }

        setQueryParams(params);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const changeExternalSource = (value: string) => {
        const params: Record<string, string> = {page: '1', source: value};

        if (draftQuery.trim()) {
            params.query = draftQuery.trim();
        }

        setQueryParams(params, {replace: true});
    };

    if (!menuItem) {
        return (
            <main className={css.ExplorePage}>
                <BadgesList/>
                <EmptyState
                    title="TMDB section not found"
                    message="This API menu item is not configured."
                    actionLabel="Open movies"
                    onAction={() => navigate('/explore/movies/popular?page=1')}
                />
            </main>
        );
    }

    const needsSearch = menuItem.requiresQuery && !queryValue.trim();
    const showPagination = !menuItem.requiresQuery || Boolean(queryValue.trim());
    const canPrev = page > 1;
    const canNext = page < Math.min(totalPages || 1, 500);

    return (
        <main className={css.ExplorePage}>
            <BadgesList/>

            <section className={css.heading}>
                <div>
                    <p className={css.kicker}>{menuItem.group}</p>
                    <h1>{menuItem.label}</h1>
                    <p>{menuItem.description}</p>
                </div>
                <div className={css.stats} aria-label="Result summary">
                    <span>{menuItem.kind}</span>
                    <strong>{totalResults ? totalResults.toLocaleString('en-US') : menuItem.badge}</strong>
                </div>
            </section>

            {menuItem.requiresQuery && (
                <form className={css.searchPanel} role="search" onSubmit={preventSubmit}>
                    <SearchRoundedIcon className={css.searchIcon} aria-hidden="true"/>
                    <input
                        type="search"
                        value={draftQuery}
                        onChange={handleSearchChange}
                        placeholder={menuItem.queryPlaceholder || `Search ${menuItem.label.toLowerCase()}`}
                        aria-label={`Search ${menuItem.label.toLowerCase()}`}
                    />
                    {!!draftQuery && (
                        <button type="button" onClick={clearSearch} aria-label="Clear search">
                            <CloseRoundedIcon fontSize="small"/>
                        </button>
                    )}
                </form>
            )}

            {menuItem.kind === 'find' && (
                <div className={css.sourcePanel}>
                    {externalSources.map(source => (
                        <button
                            key={source.value}
                            type="button"
                            className={sourceValue === source.value ? css.activeSource : ''}
                            onClick={() => changeExternalSource(source.value)}
                        >
                            {source.label}
                        </button>
                    ))}
                </div>
            )}

            {needsSearch && (
                <EmptyState
                    title="Start with a search"
                    message={`Type a query to load ${menuItem.label.toLowerCase()} from TMDB.`}
                />
            )}

            {!needsSearch && loading && <Loading/>}

            {!needsSearch && !loading && error && (
                <EmptyState
                    title="TMDB request failed"
                    message={error}
                    actionLabel="Try again"
                    onAction={goToFirstPage}
                />
            )}

            {!needsSearch && !loading && !error && !items.length && (
                <EmptyState
                    title="No results"
                    message="TMDB returned an empty response for this request."
                />
            )}

            {!needsSearch && !loading && !error && !!items.length && (
                <section className={`${css.grid} ${menuItem.kind === 'static' ? css.staticGrid : ''}`}>
                    {items.map((item: TmdbExploreItem, index: number) => (
                        <TmdbMediaCard
                            key={`${menuItem.section}-${menuItem.endpoint}-${'id' in item ? item.id : index}`}
                            item={item}
                            resultType={menuItem.resultType}
                            index={index}
                        />
                    ))}
                </section>
            )}

            {!loading && !error && showPagination && totalPages > 1 && (
                <nav className={css.pagination} aria-label="Explore pagination">
                    <button type="button" onClick={() => changePage(page - 1)} disabled={!canPrev}>Prev</button>
                    <span aria-current="page">Page {page} of {Math.min(totalPages, 500)}</span>
                    <button type="button" onClick={() => changePage(page + 1)} disabled={!canNext}>Next</button>
                </nav>
            )}
        </main>
    );
};

export {ExplorePage};
