import {CSSProperties, FC, useEffect, useMemo, useState} from 'react';
import {Rating} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';

import {EmptyState, Loading, TmdbMediaCard} from "../../components";
import {
    IGenreBadge,
    IVideo,
    ITmdbAlternativeTitle,
    ITmdbCastMember,
    ITmdbCompany,
    ITmdbContentRating,
    ITmdbCredits,
    ITmdbCrewMember,
    ITmdbImage,
    ITmdbKeyword,
    ITmdbMovie,
    ITmdbMovieDetail,
    ITmdbPersonDetail,
    ITmdbProvider,
    ITmdbReleaseDateRegion,
    ITmdbReview,
    ITmdbTranslation,
    ITmdbTV,
    ITmdbTVDetail,
    TmdbDetail,
    TmdbMediaType
} from "../../interfaces";
import {backdropBaseUrl, posterBaseUrl, profileBaseUrl} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {tmdbActions} from "../../store";
import css from './TmdbDetailPage.module.css';

interface IProps {
    mediaType: TmdbMediaType;
}

interface ITab {
    id: string;
    label: string;
    count?: number;
}

interface IStat {
    label: string;
    value: string;
}

const getTitle = (detail: TmdbDetail, mediaType: TmdbMediaType): string => {
    if (mediaType === 'movie') {
        const movie = detail as ITmdbMovieDetail;
        return movie.title || movie.original_title || 'Untitled movie';
    }

    if (mediaType === 'tv') {
        const tv = detail as ITmdbTVDetail;
        return tv.name || tv.original_name || 'Untitled show';
    }

    return (detail as ITmdbPersonDetail).name || 'Unknown person';
};

const getYear = (detail: TmdbDetail, mediaType: TmdbMediaType): string => {
    if (mediaType === 'movie') {
        return (detail as ITmdbMovieDetail).release_date?.substring(0, 4) || '';
    }

    if (mediaType === 'tv') {
        return (detail as ITmdbTVDetail).first_air_date?.substring(0, 4) || '';
    }

    return (detail as ITmdbPersonDetail).birthday?.substring(0, 4) || '';
};

const getOverview = (detail: TmdbDetail, mediaType: TmdbMediaType): string => {
    if (mediaType === 'person') {
        return (detail as ITmdbPersonDetail).biography || 'No biography is available for this person yet.';
    }

    return (detail as ITmdbMovieDetail | ITmdbTVDetail).overview || 'No overview is available for this title yet.';
};

const getCredits = (detail: TmdbDetail, mediaType: TmdbMediaType): ITmdbCredits => {
    if (mediaType === 'person') {
        return (detail as ITmdbPersonDetail).combined_credits || {cast: [], crew: []};
    }

    const tv = detail as ITmdbTVDetail;
    return tv.aggregate_credits || (detail as ITmdbMovieDetail | ITmdbTVDetail).credits || {cast: [], crew: []};
};

const getKeywords = (detail: TmdbDetail): ITmdbKeyword[] => {
    const keywords = (detail as ITmdbMovieDetail | ITmdbTVDetail).keywords;
    return keywords?.keywords || keywords?.results || [];
};

const getRecommendations = (detail: TmdbDetail, mediaType: TmdbMediaType): Array<ITmdbMovie | ITmdbTV> => {
    if (mediaType === 'person') {
        return [];
    }

    return ((detail as ITmdbMovieDetail | ITmdbTVDetail).recommendations?.results || []) as Array<ITmdbMovie | ITmdbTV>;
};

const getSimilar = (detail: TmdbDetail, mediaType: TmdbMediaType): Array<ITmdbMovie | ITmdbTV> => {
    if (mediaType === 'person') {
        return [];
    }

    return ((detail as ITmdbMovieDetail | ITmdbTVDetail).similar?.results || []) as Array<ITmdbMovie | ITmdbTV>;
};

const getAlternativeTitles = (detail: TmdbDetail, mediaType: TmdbMediaType): ITmdbAlternativeTitle[] => {
    if (mediaType === 'person') {
        return [];
    }

    const alternativeTitles = (detail as ITmdbMovieDetail | ITmdbTVDetail).alternative_titles;
    return alternativeTitles?.titles || alternativeTitles?.results || [];
};

const formatCurrency = (value?: number): string => {
    if (!value) {
        return '';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
};

const clampText = (value: string, maxLength = 420): string => {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength).trim()}...`;
};

const renderCreditList = (items: Array<ITmdbCastMember | ITmdbCrewMember>, emptyLabel: string) => {
    if (!items.length) {
        return <p className={css.muted}>{emptyLabel}</p>;
    }

    return (
        <div className={css.peopleGrid}>
            {items.slice(0, 24).map((item: ITmdbCastMember | ITmdbCrewMember) => {
                const crewItem = item as ITmdbCrewMember;
                const role = 'character' in item ? item.character : crewItem.job || crewItem.department;

                return (
                    <article key={item.credit_id} className={css.personMini}>
                        {item.profile_path ? (
                            <img src={`${profileBaseUrl}${item.profile_path}`} alt={item.name} loading="lazy"/>
                        ) : (
                            <span aria-hidden="true">{item.name.charAt(0)}</span>
                        )}
                        <div>
                            <strong>{item.name}</strong>
                            {role && <small>{role}</small>}
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

const renderImages = (images: ITmdbImage[] = []) => {
    if (!images.length) {
        return <p className={css.muted}>No images were returned for this tab.</p>;
    }

    return (
        <div className={css.imageGrid}>
            {images.slice(0, 18).map(image => (
                <img key={image.file_path} src={`${posterBaseUrl}${image.file_path}`} alt="" loading="lazy"/>
            ))}
        </div>
    );
};

const renderReviews = (reviews: ITmdbReview[] = []) => {
    if (!reviews.length) {
        return <p className={css.muted}>No reviews yet.</p>;
    }

    return (
        <div className={css.reviewList}>
            {reviews.slice(0, 8).map(review => (
                <article key={review.id} className={css.reviewCard}>
                    <div>
                        <strong>{review.author}</strong>
                        {review.author_details?.rating && <span>{review.author_details.rating}/10</span>}
                    </div>
                    <p>{review.content}</p>
                    <a href={review.url} target="_blank" rel="noreferrer">
                        Read on TMDB <OpenInNewRoundedIcon fontSize="inherit"/>
                    </a>
                </article>
            ))}
        </div>
    );
};

const TmdbDetailPage: FC<IProps> = ({mediaType}) => {
    const {id, movieId} = useParams<{ id: string; movieId: string }>();
    const numericId = Number(id || movieId);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {detail, detailError, detailLoading} = useAppSelector(state => state.tmdb);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!Number.isFinite(numericId) || numericId <= 0) {
            return;
        }

        const promise = dispatch(tmdbActions.getDetail({mediaType, id: numericId}));

        return () => {
            promise.abort();
        };
    }, [dispatch, mediaType, numericId]);

    useEffect(() => {
        setActiveTab('overview');
    }, [mediaType, numericId]);

    const tabs = useMemo<ITab[]>(() => {
        if (!detail) {
            return [];
        }

        const credits = getCredits(detail, mediaType);
        const images = detail.images;
        const videos = mediaType === 'person' ? [] : ((detail as ITmdbMovieDetail | ITmdbTVDetail).videos?.results || []);
        const reviews = mediaType === 'person' ? [] : ((detail as ITmdbMovieDetail | ITmdbTVDetail).reviews?.results || []);
        const providers = mediaType === 'person' ? [] : Object.keys((detail as ITmdbMovieDetail | ITmdbTVDetail)["watch/providers"]?.results || {});
        const alternativeTitles = getAlternativeTitles(detail, mediaType);
        const releaseOrRatingsCount = mediaType === 'movie'
            ? ((detail as ITmdbMovieDetail).release_dates?.results?.length || 0)
            : mediaType === 'tv'
                ? ((detail as ITmdbTVDetail).content_ratings?.results?.length || 0)
                : 0;

        return [
            {id: 'overview', label: 'Overview'},
            {id: 'credits', label: 'Credits', count: (credits.cast?.length || 0) + (credits.crew?.length || 0)},
            {id: 'videos', label: 'Videos', count: videos.length},
            {id: 'images', label: 'Images', count: (images?.posters?.length || 0) + (images?.backdrops?.length || 0) + (images?.profiles?.length || 0)},
            {id: 'release', label: 'Titles & Ratings', count: alternativeTitles.length + releaseOrRatingsCount},
            {id: 'recommendations', label: 'Recommendations', count: getRecommendations(detail, mediaType).length},
            {id: 'similar', label: 'Similar', count: getSimilar(detail, mediaType).length},
            {id: 'reviews', label: 'Reviews', count: reviews.length},
            {id: 'external', label: 'External IDs'},
            {id: 'keywords', label: 'Keywords', count: getKeywords(detail).length},
            {id: 'providers', label: 'Watch Providers', count: providers.length},
            {id: 'translations', label: 'Translations', count: detail.translations?.translations?.length || 0}
        ].filter(tab => {
            if (mediaType === 'person') {
                return !['videos', 'recommendations', 'similar', 'reviews', 'keywords', 'providers'].includes(tab.id);
            }

            return true;
        });
    }, [detail, mediaType]);

    if (detailLoading) {
        return (
            <main className={css.DetailPage}>
                <Loading/>
            </main>
        );
    }

    if (!detail || detailError) {
        return (
            <main className={css.DetailPage}>
                <EmptyState
                    title="Details are unavailable"
                    message={detailError || 'TMDB did not return this item.'}
                    actionLabel="Back to explore"
                    onAction={() => navigate('/explore/movies/popular?page=1')}
                />
            </main>
        );
    }

    const title = getTitle(detail, mediaType);
    const year = getYear(detail, mediaType);
    const overview = getOverview(detail, mediaType);
    const movieOrTv = detail as ITmdbMovieDetail | ITmdbTVDetail;
    const person = detail as ITmdbPersonDetail;
    const posterPath = mediaType === 'person' ? person.profile_path : movieOrTv.poster_path;
    const backdropPath = mediaType === 'person' ? '' : movieOrTv.backdrop_path;
    const heroStyle = {
        '--detail-backdrop': backdropPath ? `url(${backdropBaseUrl}${backdropPath})` : 'none'
    } as CSSProperties;
    const voteAverage = mediaType === 'person' ? 0 : Number(movieOrTv.vote_average || 0);
    const credits = getCredits(detail, mediaType);
    const videos = mediaType === 'person' ? [] : (movieOrTv.videos?.results || []);
    const imageSet = detail.images;
    const recommendations = getRecommendations(detail, mediaType);
    const similar = getSimilar(detail, mediaType);
    const reviews = mediaType === 'person' ? [] : (movieOrTv.reviews?.results || []);
    const externalIds = detail.external_ids || {};
    const keywords = getKeywords(detail);
    const watchProviders = mediaType === 'person' ? {} : (movieOrTv["watch/providers"]?.results || {});
    const translations = detail.translations?.translations || [];
    const alternativeTitles = getAlternativeTitles(detail, mediaType);
    const releaseDates = mediaType === 'movie' ? ((detail as ITmdbMovieDetail).release_dates?.results || []) : [];
    const contentRatings = mediaType === 'tv' ? ((detail as ITmdbTVDetail).content_ratings?.results || []) : [];
    const homepage = mediaType === 'person' ? person.homepage : movieOrTv.homepage;
    const imdbId = mediaType === 'movie'
        ? (detail as ITmdbMovieDetail).imdb_id || externalIds.imdb_id
        : mediaType === 'person'
            ? person.imdb_id || externalIds.imdb_id
            : externalIds.imdb_id;
    const tmdbUrl = `https://www.themoviedb.org/${mediaType}/${numericId}`;
    const primaryVideo = videos.find(video => video.site === 'YouTube' && video.type === 'Trailer') || videos[0];
    const quickStats = ([
        mediaType !== 'person' && movieOrTv.status ? {label: 'Status', value: movieOrTv.status} : null,
        mediaType === 'movie' && (detail as ITmdbMovieDetail).runtime ? {label: 'Runtime', value: `${(detail as ITmdbMovieDetail).runtime} min`} : null,
        mediaType === 'tv' && (detail as ITmdbTVDetail).number_of_seasons ? {label: 'Seasons', value: `${(detail as ITmdbTVDetail).number_of_seasons}`} : null,
        mediaType === 'tv' && (detail as ITmdbTVDetail).number_of_episodes ? {label: 'Episodes', value: `${(detail as ITmdbTVDetail).number_of_episodes}`} : null,
        mediaType === 'movie' && (detail as ITmdbMovieDetail).budget ? {label: 'Budget', value: formatCurrency((detail as ITmdbMovieDetail).budget)} : null,
        mediaType === 'movie' && (detail as ITmdbMovieDetail).revenue ? {label: 'Revenue', value: formatCurrency((detail as ITmdbMovieDetail).revenue)} : null,
        mediaType === 'person' && person.place_of_birth ? {label: 'Born in', value: person.place_of_birth} : null,
        mediaType === 'person' && person.birthday ? {label: 'Birthday', value: person.birthday} : null,
        mediaType !== 'person' && movieOrTv.vote_count ? {label: 'Votes', value: movieOrTv.vote_count.toLocaleString('en-US')} : null,
        detail.popularity ? {label: 'Popularity', value: Math.round(detail.popularity).toLocaleString('en-US')} : null
    ].filter(Boolean) as IStat[]).slice(0, 6);

    return (
        <main className={css.DetailPage}>
            <section className={`${css.hero} ${!backdropPath ? css.noBackdrop : ''}`} style={heroStyle}>
                <div className={css.heroTopbar}>
                    <button type="button" className={css.backButton} onClick={() => navigate(-1)}>
                        <ArrowBackRoundedIcon fontSize="small"/>
                        <span>Back</span>
                    </button>

                    <a className={css.tmdbLink} href={tmdbUrl} target="_blank" rel="noreferrer">
                        <span>TMDB</span>
                        <OpenInNewRoundedIcon fontSize="small"/>
                    </a>
                </div>

                <div className={css.posterPanel}>
                    {posterPath ? (
                        <img src={`${mediaType === 'person' ? profileBaseUrl : posterBaseUrl}${posterPath}`} alt={title}/>
                    ) : (
                        <div className={css.posterFallback} aria-hidden="true">
                            <span>{title.charAt(0)}</span>
                        </div>
                    )}
                </div>

                <div className={css.heroContent}>
                    <p className={css.kicker}>{[mediaType.toUpperCase(), year].filter(Boolean).join(' / ')}</p>
                    <h1>{title}</h1>
                    {mediaType !== 'person' && movieOrTv.tagline && <p className={css.tagline}>{movieOrTv.tagline}</p>}
                    {mediaType === 'person' && person.known_for_department && <p className={css.tagline}>{person.known_for_department}</p>}

                    <p className={css.heroOverview}>{clampText(overview)}</p>

                    <div className={css.heroActions}>
                        {mediaType !== 'person' && (
                            <div className={css.ratingBlock}>
                                <span>{voteAverage ? voteAverage.toFixed(1) : 'NR'}</span>
                                <Rating
                                    className={css.rating}
                                    name={`detail-rating-${mediaType}-${numericId}`}
                                    value={voteAverage / 2}
                                    readOnly
                                    max={5}
                                    precision={0.1}
                                />
                            </div>
                        )}

                        {primaryVideo && (
                            <a
                                className={css.primaryAction}
                                href={`https://www.youtube.com/watch?v=${primaryVideo.key}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <PlayArrowRoundedIcon fontSize="small"/>
                                <span>Trailer</span>
                            </a>
                        )}

                        {homepage && (
                            <a className={css.secondaryAction} href={homepage} target="_blank" rel="noreferrer">
                                <LinkRoundedIcon fontSize="small"/>
                                <span>Website</span>
                            </a>
                        )}

                        {imdbId && (
                            <a className={css.secondaryAction} href={`https://www.imdb.com/title/${imdbId}`} target="_blank" rel="noreferrer">
                                <OpenInNewRoundedIcon fontSize="small"/>
                                <span>IMDb</span>
                            </a>
                        )}
                    </div>

                    {!!quickStats.length && (
                        <div className={css.statGrid} aria-label="Key facts">
                            {quickStats.map(stat => (
                                <div key={`${stat.label}-${stat.value}`} className={css.statCard}>
                                    <span>{stat.label}</span>
                                    <strong>{stat.value}</strong>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={css.metaGrid}>
                        {mediaType !== 'person' && movieOrTv.status && <span>{movieOrTv.status}</span>}
                        {mediaType === 'movie' && (detail as ITmdbMovieDetail).runtime && <span>{(detail as ITmdbMovieDetail).runtime} min</span>}
                        {mediaType === 'tv' && (detail as ITmdbTVDetail).number_of_seasons && <span>{(detail as ITmdbTVDetail).number_of_seasons} seasons</span>}
                        {mediaType === 'person' && person.place_of_birth && <span>{person.place_of_birth}</span>}
                        {mediaType !== 'person' && movieOrTv.genres?.slice(0, 5).map((genre: IGenreBadge) => <span key={genre.id}>{genre.name}</span>)}
                    </div>
                </div>
            </section>

            <section className={css.tabShell}>
                <div className={css.detailNav}>
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
                                <span>{tab.label}</span>
                                {typeof tab.count === 'number' && <small>{tab.count}</small>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={css.panel}>
                    {activeTab === 'overview' && (
                        <div className={css.overviewPanel}>
                            <h2>Overview</h2>
                            <p>{overview}</p>
                            {mediaType === 'person' && person.also_known_as?.length > 0 && (
                                <div className={css.chipList}>
                                    {person.also_known_as.slice(0, 10).map((name: string) => <span key={name}>{name}</span>)}
                                </div>
                            )}
                            {mediaType !== 'person' && movieOrTv.production_companies?.length > 0 && (
                                <div className={css.chipList}>
                                    {movieOrTv.production_companies.slice(0, 8).map((company: ITmdbCompany) => <span key={company.id}>{company.name}</span>)}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'credits' && (
                        <div className={css.stack}>
                            <h2>Cast</h2>
                            {renderCreditList(credits.cast || [], 'No cast data returned.')}
                            <h2>Crew</h2>
                            {renderCreditList(credits.crew || [], 'No crew data returned.')}
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div className={css.videoGrid}>
                            {videos.length ? videos.slice(0, 8).map((video: IVideo) => (
                                <article key={video.id} className={css.videoCard}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title={video.name}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                    <strong><PlayArrowRoundedIcon fontSize="inherit"/>{video.name}</strong>
                                </article>
                            )) : <p className={css.muted}>No videos yet.</p>}
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className={css.stack}>
                            <h2>Posters / Profiles</h2>
                            {renderImages(imageSet?.posters || imageSet?.profiles || [])}
                            <h2>Backdrops</h2>
                            {renderImages(imageSet?.backdrops || [])}
                        </div>
                    )}

                    {activeTab === 'release' && (
                        <div className={css.stack}>
                            <h2>Alternative Titles</h2>
                            <div className={css.chipList}>
                                {alternativeTitles.length ? alternativeTitles.slice(0, 40).map((title: ITmdbAlternativeTitle) => (
                                    <span key={`${title.iso_3166_1}-${title.title}`}>{title.iso_3166_1}: {title.title}</span>
                                )) : <p className={css.muted}>No alternative titles returned.</p>}
                            </div>

                            {mediaType === 'movie' && (
                                <>
                                    <h2>Release Dates</h2>
                                    <div className={css.keyValueGrid}>
                                        {releaseDates.length ? releaseDates.slice(0, 24).map((region: ITmdbReleaseDateRegion) => {
                                            const firstRelease = region.release_dates?.[0];

                                            return (
                                                <div key={region.iso_3166_1}>
                                                    <span>{region.iso_3166_1}</span>
                                                    <strong>{firstRelease?.certification || firstRelease?.release_date?.substring(0, 10) || 'Release data'}</strong>
                                                </div>
                                            );
                                        }) : <p className={css.muted}>No release dates returned.</p>}
                                    </div>
                                </>
                            )}

                            {mediaType === 'tv' && (
                                <>
                                    <h2>Content Ratings</h2>
                                    <div className={css.keyValueGrid}>
                                        {contentRatings.length ? contentRatings.map((rating: ITmdbContentRating) => (
                                            <div key={rating.iso_3166_1}>
                                                <span>{rating.iso_3166_1}</span>
                                                <strong>{rating.rating || 'Not rated'}</strong>
                                            </div>
                                        )) : <p className={css.muted}>No content ratings returned.</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'recommendations' && (
                        <div className={css.mediaGrid}>
                            {recommendations.length ? recommendations.slice(0, 12).map((item: ITmdbMovie | ITmdbTV, index: number) => (
                                <TmdbMediaCard key={item.id} item={item} resultType={mediaType === 'movie' ? 'movie' : 'tv'} index={index}/>
                            )) : <p className={css.muted}>No recommendations yet.</p>}
                        </div>
                    )}

                    {activeTab === 'similar' && (
                        <div className={css.mediaGrid}>
                            {similar.length ? similar.slice(0, 12).map((item: ITmdbMovie | ITmdbTV, index: number) => (
                                <TmdbMediaCard key={item.id} item={item} resultType={mediaType === 'movie' ? 'movie' : 'tv'} index={index}/>
                            )) : <p className={css.muted}>No similar titles yet.</p>}
                        </div>
                    )}

                    {activeTab === 'reviews' && renderReviews(reviews)}

                    {activeTab === 'external' && (
                        <div className={css.keyValueGrid}>
                            {Object.entries(externalIds)
                                .filter(([, value]) => Boolean(value))
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <span>{key.replaceAll('_', ' ')}</span>
                                        <strong>{String(value)}</strong>
                                    </div>
                                ))}
                            {!Object.values(externalIds).some(Boolean) && <p className={css.muted}>No external IDs returned.</p>}
                        </div>
                    )}

                    {activeTab === 'keywords' && (
                        <div className={css.chipList}>
                            {keywords.length ? keywords.map((keyword: ITmdbKeyword) => <span key={keyword.id}>{keyword.name}</span>) : <p className={css.muted}>No keywords returned.</p>}
                        </div>
                    )}

                    {activeTab === 'providers' && (
                        <div className={css.providerList}>
                            {Object.entries(watchProviders).slice(0, 18).map(([region, providerGroup]) => (
                                <article key={region}>
                                    <strong>{region}</strong>
                                    <div>
                                        {(['flatrate', 'rent', 'buy', 'ads', 'free'] as const).map(kind => (
                                            providerGroup[kind]?.length ? (
                                                <span key={kind}>{kind}: {providerGroup[kind]?.map((provider: ITmdbProvider) => provider.provider_name).join(', ')}</span>
                                            ) : null
                                        ))}
                                    </div>
                                </article>
                            ))}
                            {!Object.keys(watchProviders).length && <p className={css.muted}>No watch provider data returned.</p>}
                        </div>
                    )}

                    {activeTab === 'translations' && (
                        <div className={css.translationGrid}>
                            {translations.length ? translations.slice(0, 36).map((translation: ITmdbTranslation) => (
                                <article key={`${translation.iso_639_1}-${translation.iso_3166_1}`}>
                                    <strong>{translation.english_name}</strong>
                                    <span>{translation.iso_639_1}-{translation.iso_3166_1}</span>
                                </article>
                            )) : <p className={css.muted}>No translations returned.</p>}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export {TmdbDetailPage};
