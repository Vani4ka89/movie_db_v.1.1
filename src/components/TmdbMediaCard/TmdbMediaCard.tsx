import {CSSProperties, FC, KeyboardEvent, useMemo} from 'react';
import {Rating} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {
    IGenreBadge,
    ITmdbCertification,
    ITmdbCollection,
    ITmdbCompany,
    ITmdbConfiguration,
    ITmdbCountry,
    ITmdbJobDepartment,
    ITmdbKeyword,
    ITmdbLanguage,
    ITmdbMovie,
    ITmdbPerson,
    ITmdbPrimaryTranslation,
    ITmdbProvider,
    ITmdbTimezone,
    ITmdbTV,
    TmdbExploreItem,
    TmdbResultType
} from "../../interfaces";
import {posterBaseUrl, profileBaseUrl} from "../../constants";
import {useAppSelector} from "../../hooks";
import css from './TmdbMediaCard.module.css';

interface IProps {
    item: TmdbExploreItem;
    resultType: TmdbResultType;
    index?: number;
}

const hasMediaType = (item: TmdbExploreItem): item is TmdbExploreItem & { media_type: string } => 'media_type' in item;
const isMovie = (item: TmdbExploreItem): item is ITmdbMovie => 'title' in item || (hasMediaType(item) && item.media_type === 'movie');
const isTV = (item: TmdbExploreItem): item is ITmdbTV => 'name' in item && ('first_air_date' in item || (hasMediaType(item) && item.media_type === 'tv'));
const isPerson = (item: TmdbExploreItem): item is ITmdbPerson => 'known_for_department' in item || (hasMediaType(item) && item.media_type === 'person');
const isProvider = (item: TmdbExploreItem): item is ITmdbProvider => 'provider_name' in item;
const isGenre = (item: TmdbExploreItem, resultType: TmdbResultType): item is IGenreBadge => resultType === 'genre' && 'name' in item;
const isLanguage = (item: TmdbExploreItem): item is ITmdbLanguage => 'iso_639_1' in item && 'english_name' in item;
const isCountry = (item: TmdbExploreItem): item is ITmdbCountry => 'iso_3166_1' in item && 'english_name' in item && !('zones' in item);
const isTimezone = (item: TmdbExploreItem): item is ITmdbTimezone => 'zones' in item;
const isConfiguration = (item: TmdbExploreItem): item is ITmdbConfiguration => 'images' in item && 'change_keys' in item;
const isCertification = (item: TmdbExploreItem): item is ITmdbCertification => 'certification' in item && 'meaning' in item;
const isJobDepartment = (item: TmdbExploreItem): item is ITmdbJobDepartment => 'department' in item && 'jobs' in item;
const isPrimaryTranslation = (item: TmdbExploreItem): item is ITmdbPrimaryTranslation => 'code' in item && hasMediaType(item) && item.media_type === 'translation';
const isCompany = (item: TmdbExploreItem, resultType: TmdbResultType): item is ITmdbCompany =>
    resultType === 'company' || (hasMediaType(item) && item.media_type === 'company') || 'origin_country' in item || 'headquarters' in item;
const isKeyword = (item: TmdbExploreItem, resultType: TmdbResultType): item is ITmdbKeyword =>
    resultType === 'keyword' || (hasMediaType(item) && item.media_type === 'keyword');
const isCollection = (item: TmdbExploreItem, resultType: TmdbResultType): item is ITmdbCollection =>
    resultType === 'collection' || (hasMediaType(item) && item.media_type === 'collection') || ('name' in item && ('poster_path' in item || 'backdrop_path' in item));

const TmdbMediaCard: FC<IProps> = ({item, resultType, index = 0}) => {
    const {lightTheme} = useAppSelector(state => state.movies);
    const navigate = useNavigate();

    const card = useMemo(() => {
        if (isMovie(item)) {
            return {
                title: item.title || item.original_title || 'Untitled movie',
                subtitle: item.release_date?.substring(0, 4) || 'Movie',
                image: item.poster_path || item.backdrop_path,
                imageBase: posterBaseUrl,
                overview: item.overview,
                rating: item.vote_average,
                route: `/movie/${item.id}`,
                badge: 'Movie'
            };
        }

        if (isTV(item)) {
            return {
                title: item.name || item.original_name || 'Untitled show',
                subtitle: item.first_air_date?.substring(0, 4) || 'TV',
                image: item.poster_path || item.backdrop_path,
                imageBase: posterBaseUrl,
                overview: item.overview,
                rating: item.vote_average,
                route: `/tv/${item.id}`,
                badge: 'TV'
            };
        }

        if (isPerson(item)) {
            const knownFor = item.known_for?.slice(0, 2)
                .map(media => isMovie(media) ? media.title : isTV(media) ? media.name : '')
                .filter(Boolean)
                .join(', ');

            return {
                title: item.name || 'Unknown person',
                subtitle: item.known_for_department || 'Person',
                image: item.profile_path,
                imageBase: profileBaseUrl,
                overview: knownFor,
                rating: item.popularity,
                route: `/person/${item.id}`,
                badge: 'Person'
            };
        }

        if (resultType === 'change' && 'id' in item && hasMediaType(item)) {
            return {
                title: `${item.media_type.toUpperCase()} #${item.id}`,
                subtitle: 'Recently changed',
                image: '',
                imageBase: '',
                overview: 'Open the record to inspect current TMDB metadata.',
                rating: null,
                route: `/${item.media_type}/${item.id}`,
                badge: 'Change'
            };
        }

        if (isProvider(item)) {
            return {
                title: item.provider_name,
                subtitle: `Priority ${item.display_priority ?? '-'}`,
                image: item.logo_path,
                imageBase: posterBaseUrl,
                overview: 'Watch provider',
                rating: null,
                route: '',
                badge: 'Provider'
            };
        }

        if (isGenre(item, resultType)) {
            return {
                title: item.name,
                subtitle: `Genre #${item.id}`,
                image: '',
                imageBase: '',
                overview: 'Official TMDB genre.',
                rating: null,
                route: '',
                badge: 'Genre'
            };
        }

        if (isConfiguration(item)) {
            return {
                title: 'TMDB Image Configuration',
                subtitle: item.images.secure_base_url,
                image: '',
                imageBase: '',
                overview: `Poster sizes: ${item.images.poster_sizes.join(', ')}`,
                rating: null,
                route: '',
                badge: 'Config'
            };
        }

        if (isCertification(item)) {
            return {
                title: item.certification,
                subtitle: item.iso_3166_1,
                image: '',
                imageBase: '',
                overview: item.meaning,
                rating: null,
                route: '',
                badge: 'Certification'
            };
        }

        if (isJobDepartment(item)) {
            return {
                title: item.department,
                subtitle: `${item.jobs.length} jobs`,
                image: '',
                imageBase: '',
                overview: item.jobs.slice(0, 8).join(', '),
                rating: null,
                route: '',
                badge: 'Jobs'
            };
        }

        if (isPrimaryTranslation(item)) {
            return {
                title: item.code,
                subtitle: 'Primary translation',
                image: '',
                imageBase: '',
                overview: 'Locale supported by TMDB primary translations.',
                rating: null,
                route: '',
                badge: 'Locale'
            };
        }

        if (isTimezone(item)) {
            return {
                title: item.iso_3166_1,
                subtitle: `${item.zones.length} timezones`,
                image: '',
                imageBase: '',
                overview: item.zones.slice(0, 5).join(', '),
                rating: null,
                route: '',
                badge: 'Timezones'
            };
        }

        if (isLanguage(item)) {
            return {
                title: item.english_name,
                subtitle: item.iso_639_1,
                image: '',
                imageBase: '',
                overview: item.name || 'Language',
                rating: null,
                route: '',
                badge: 'Language'
            };
        }

        if (isCountry(item)) {
            return {
                title: item.english_name,
                subtitle: item.iso_3166_1,
                image: '',
                imageBase: '',
                overview: item.native_name || 'Country',
                rating: null,
                route: '',
                badge: 'Country'
            };
        }

        if (isCompany(item, resultType)) {
            const company = item as ITmdbCompany;

            return {
                title: company.name,
                subtitle: company.origin_country || 'Company',
                image: company.logo_path,
                imageBase: posterBaseUrl,
                overview: company.headquarters || company.description || 'Production company',
                rating: null,
                route: `/company/${company.id}`,
                badge: 'Company'
            };
        }

        if (isCollection(item, resultType)) {
            const collection = item as ITmdbCollection;

            return {
                title: collection.name,
                subtitle: 'Collection',
                image: collection.poster_path || collection.backdrop_path,
                imageBase: posterBaseUrl,
                overview: collection.overview,
                rating: null,
                route: `/collection/${collection.id}`,
                badge: 'Collection'
            };
        }

        if (isKeyword(item, resultType)) {
            const keyword = item as ITmdbKeyword;

            return {
                title: keyword.name,
                subtitle: `Keyword #${keyword.id}`,
                image: '',
                imageBase: '',
                overview: 'TMDB keyword',
                rating: null,
                route: `/keyword/${keyword.id}`,
                badge: 'Keyword'
            };
        }

        return {
            title: 'TMDB item',
            subtitle: resultType,
            image: '',
            imageBase: '',
            overview: '',
            rating: null,
            route: '',
            badge: resultType
        };
    }, [item, resultType]);

    const openDetails = () => {
        if (card.route) {
            navigate(card.route);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!card.route) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetails();
        }
    };

    const cardStyle = {
        animationDelay: `${Math.min(index, 18) * 36}ms`
    } as CSSProperties;

    const ratingLabel = typeof card.rating === 'number' && card.rating > 0 ? card.rating.toFixed(1) : '';
    const isInteractive = Boolean(card.route);

    return (
        <article
            className={`${css.card} ${lightTheme ? css.cardLight : css.cardDark} ${isInteractive ? css.interactive : ''}`}
            style={cardStyle}
            onClick={openDetails}
            tabIndex={isInteractive ? 0 : undefined}
            role={isInteractive ? 'button' : undefined}
            aria-label={isInteractive ? `Open details for ${card.title}` : undefined}
            onKeyDown={handleKeyDown}
        >
            <div className={css.imageBlock}>
                {card.image ? (
                    <img src={`${card.imageBase}${card.image}`} alt={card.title} loading="lazy" decoding="async"/>
                ) : (
                    <div className={css.fallback} aria-hidden="true">
                        <span>{card.title.charAt(0)}</span>
                    </div>
                )}
                <span className={css.typeBadge}>{card.badge}</span>
            </div>
            <div className={css.body}>
                <div className={css.titleBlock}>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                </div>
                {card.overview && <p className={css.overview}>{card.overview}</p>}
                {ratingLabel && (
                    <div className={css.ratingWrap} aria-label={`Rating ${ratingLabel} out of 10`}>
                        <span>{ratingLabel}</span>
                        <Rating
                            className={css.rating}
                            name={`tmdb-rating-${resultType}-${'id' in item ? item.id : card.title}`}
                            value={Number(card.rating) / 2}
                            readOnly
                            max={5}
                            precision={0.5}
                            size="small"
                        />
                    </div>
                )}
            </div>
        </article>
    );
};

export {TmdbMediaCard};
