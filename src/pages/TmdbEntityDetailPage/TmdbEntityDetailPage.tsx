import {CSSProperties, FC, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {EmptyState, Loading, TmdbMediaCard} from "../../components";
import {
    ITmdbCollectionDetail,
    ITmdbCompanyAlternativeName,
    ITmdbCompanyDetail,
    ITmdbImage,
    ITmdbKeywordDetail,
    ITmdbMovie,
    TmdbEntityType
} from "../../interfaces";
import {backdropBaseUrl, posterBaseUrl} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {tmdbActions} from "../../store";
import css from '../TmdbDetailPage/TmdbDetailPage.module.css';

interface IProps {
    entityType: TmdbEntityType;
}

interface ITab {
    id: string;
    label: string;
    count?: number;
}

const renderEntityImages = (images: ITmdbImage[] = []) => {
    if (!images.length) {
        return <p className={css.muted}>No images returned.</p>;
    }

    return (
        <div className={css.imageGrid}>
            {images.slice(0, 24).map(image => (
                <img key={image.file_path} src={`${posterBaseUrl}${image.file_path}`} alt="" loading="lazy"/>
            ))}
        </div>
    );
};

const TmdbEntityDetailPage: FC<IProps> = ({entityType}) => {
    const {id} = useParams<{ id: string }>();
    const numericId = Number(id);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {entityDetail, entityDetailError, entityDetailLoading} = useAppSelector(state => state.tmdb);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!Number.isFinite(numericId) || numericId <= 0) {
            return;
        }

        const promise = dispatch(tmdbActions.getEntityDetail({entityType, id: numericId}));

        return () => {
            promise.abort();
        };
    }, [dispatch, entityType, numericId]);

    useEffect(() => {
        setActiveTab('overview');
    }, [entityType, numericId]);

    const tabs = useMemo<ITab[]>(() => {
        if (!entityDetail) {
            return [];
        }

        if (entityType === 'collection') {
            const collection = entityDetail as ITmdbCollectionDetail;
            return [
                {id: 'overview', label: 'Overview'},
                {id: 'parts', label: 'Parts', count: collection.parts?.length || 0},
                {id: 'images', label: 'Images', count: (collection.images?.posters?.length || 0) + (collection.images?.backdrops?.length || 0)}
            ];
        }

        if (entityType === 'company') {
            const company = entityDetail as ITmdbCompanyDetail;
            return [
                {id: 'overview', label: 'Overview'},
                {id: 'names', label: 'Alternative Names', count: company.alternative_names?.length || 0},
                {id: 'images', label: 'Logos', count: company.images?.logos?.length || 0}
            ];
        }

        const keyword = entityDetail as ITmdbKeywordDetail;
        return [
            {id: 'overview', label: 'Overview'},
            {id: 'movies', label: 'Tagged Movies', count: keyword.movies?.total_results || keyword.movies?.results?.length || 0}
        ];
    }, [entityDetail, entityType]);

    if (entityDetailLoading) {
        return (
            <main className={css.DetailPage}>
                <Loading/>
            </main>
        );
    }

    if (!entityDetail || entityDetailError) {
        return (
            <main className={css.DetailPage}>
                <EmptyState
                    title="Details are unavailable"
                    message={entityDetailError || 'TMDB did not return this entity.'}
                    actionLabel="Back to explore"
                    onAction={() => navigate('/explore/search/multi?page=1')}
                />
            </main>
        );
    }

    const collection = entityDetail as ITmdbCollectionDetail;
    const company = entityDetail as ITmdbCompanyDetail;
    const keyword = entityDetail as ITmdbKeywordDetail;
    const title = entityDetail.name || `${entityType} #${numericId}`;
    const overview = entityType === 'collection'
        ? collection.overview || 'No overview is available for this collection.'
        : entityType === 'company'
            ? company.description || company.headquarters || company.homepage || 'No company overview is available.'
            : `Movies tagged with "${keyword.name}".`;
    const posterPath = entityType === 'collection' ? collection.poster_path : entityType === 'company' ? company.logo_path : '';
    const backdropPath = entityType === 'collection' ? collection.backdrop_path : '';
    const heroStyle = {
        '--detail-backdrop': backdropPath ? `url(${backdropBaseUrl}${backdropPath})` : 'none'
    } as CSSProperties;

    return (
        <main className={css.DetailPage}>
            <section className={`${css.hero} ${!backdropPath ? css.noBackdrop : ''}`} style={heroStyle}>
                <div className={css.posterPanel}>
                    {posterPath ? (
                        <img src={`${posterBaseUrl}${posterPath}`} alt={title}/>
                    ) : (
                        <div className={css.posterFallback} aria-hidden="true">
                            <span>{title.charAt(0)}</span>
                        </div>
                    )}
                </div>

                <div className={css.heroContent}>
                    <p className={css.kicker}>{entityType.toUpperCase()}</p>
                    <h1>{title}</h1>
                    <p className={css.tagline}>{overview}</p>
                    <div className={css.metaGrid}>
                        <span>TMDB #{numericId}</span>
                        {entityType === 'company' && company.origin_country && <span>{company.origin_country}</span>}
                        {entityType === 'company' && company.headquarters && <span>{company.headquarters}</span>}
                        {entityType === 'collection' && collection.parts?.length > 0 && <span>{collection.parts.length} parts</span>}
                        {entityType === 'keyword' && keyword.movies?.total_results && <span>{keyword.movies.total_results.toLocaleString('en-US')} movies</span>}
                    </div>
                </div>
            </section>

            <section className={css.tabShell}>
                <div className={css.tabs} role="tablist" aria-label={`${title} details`}>
                    {tabs.map((tab: ITab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={activeTab === tab.id ? css.activeTab : ''}
                            onClick={() => setActiveTab(tab.id)}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            {tab.label}
                            {typeof tab.count === 'number' && <span>{tab.count}</span>}
                        </button>
                    ))}
                </div>

                <div className={css.panel}>
                    {activeTab === 'overview' && (
                        <div className={css.overviewPanel}>
                            <h2>Overview</h2>
                            <p>{overview}</p>
                            {entityType === 'company' && company.homepage && (
                                <div className={css.chipList}>
                                    <span>{company.homepage}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'parts' && (
                        <div className={css.mediaGrid}>
                            {collection.parts?.length ? collection.parts.map((movie: ITmdbMovie, index: number) => (
                                <TmdbMediaCard key={movie.id} item={movie} resultType="movie" index={index}/>
                            )) : <p className={css.muted}>No collection parts returned.</p>}
                        </div>
                    )}

                    {activeTab === 'movies' && (
                        <div className={css.mediaGrid}>
                            {keyword.movies?.results?.length ? keyword.movies.results.slice(0, 20).map((movie: ITmdbMovie, index: number) => (
                                <TmdbMediaCard key={movie.id} item={movie} resultType="movie" index={index}/>
                            )) : <p className={css.muted}>No tagged movies returned.</p>}
                        </div>
                    )}

                    {activeTab === 'names' && (
                        <div className={css.chipList}>
                            {company.alternative_names?.length ? company.alternative_names.map((name: ITmdbCompanyAlternativeName) => (
                                <span key={`${name.name}-${name.type || 'alias'}`}>{name.name}</span>
                            )) : <p className={css.muted}>No alternative names returned.</p>}
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className={css.stack}>
                            <h2>{entityType === 'company' ? 'Logos' : 'Posters'}</h2>
                            {renderEntityImages(entityType === 'company' ? company.images?.logos : collection.images?.posters)}
                            {entityType === 'collection' && (
                                <>
                                    <h2>Backdrops</h2>
                                    {renderEntityImages(collection.images?.backdrops)}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export {TmdbEntityDetailPage};
