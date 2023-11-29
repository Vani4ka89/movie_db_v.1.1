import {FC} from 'react';
import {useParams} from "react-router-dom";

import {MovieInfo} from "../../components";

const MovieInfoPage: FC = () => {

    const {movieId} = useParams<{ movieId: string }>();

    return (
        <div>
            <MovieInfo movieId={movieId}/>
        </div>
    );
};

export {MovieInfoPage};