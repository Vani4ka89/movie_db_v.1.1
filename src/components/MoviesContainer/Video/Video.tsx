import {FC, PropsWithChildren} from 'react';

import {IVideo} from "../../../interfaces";
import css from './Video.module.css';

interface IProps extends PropsWithChildren {
    trailer: IVideo;
}

const Video: FC<IProps> = ({trailer}) => {
    const {key, type} = trailer;

    return (
        <div className={css.Video}>
            {type &&
                <div className={css.frame}>
                    <iframe
                        src={`https://www.youtube.com/embed/${key}?si=AkJBVRgR699ZLWzR`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>
                    </iframe>
                </div>}
        </div>
    );
};

export {Video};
