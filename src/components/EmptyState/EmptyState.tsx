import {FC} from 'react';

import {useAppSelector} from "../../hooks";
import css from './EmptyState.module.css';

interface IProps {
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: FC<IProps> = ({title, message, actionLabel, onAction}) => {
    const {lightTheme} = useAppSelector(state => state.movies);

    return (
        <section className={`${css.EmptyState} ${lightTheme ? css.EmptyStateLight : css.EmptyStateDark}`}>
            <div className={css.mark} aria-hidden="true">
                <span/>
            </div>
            <div className={css.copy}>
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
            {actionLabel && onAction && (
                <button type="button" className={css.actionButton} onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </section>
    );
};

export {EmptyState};
