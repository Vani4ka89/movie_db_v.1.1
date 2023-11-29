import {FC, useEffect} from 'react';

import {useAppDispatch, useAppSelector} from "../../../hooks";
import {genresActions} from "../../../store";
import {Badge} from "../Badge/Badge";
import css from './BadgesList.module.css';

const BadgesList: FC = () => {

    const {badges} = useAppSelector(state => state.genres);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(genresActions.getBadges());
    }, [dispatch]);

    return (
        <div className={css.BadgesList}>
            {badges.map(badge => <Badge key={badge.id} badge={badge}/>)}
        </div>
    );
};

export {BadgesList};