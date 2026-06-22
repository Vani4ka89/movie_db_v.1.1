import React, {FC} from 'react';

import css from './Loading.module.css';

const Loading: FC = () => {
    return (
        <div className={css.container} role="status" aria-live="polite">
            <div className={css.loader} aria-hidden="true">
                <div className={css.poster}></div>
                <div className={css.poster}></div>
                <div className={css.poster}></div>
                <div className={css.poster}></div>
            </div>
            <div className={css.copy}>
                <span className={css.pulse}></span>
                <span>Loading cinema</span>
            </div>
        </div>
    );
};

export {Loading};
