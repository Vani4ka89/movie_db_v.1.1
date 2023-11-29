import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts";
import {MoviesPage, MovieInfoPage, VideoPage, MoviesOfGenrePage, MoviesFoundPage} from "./pages";

let router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to='movies'/>},
            {path: 'movies', element: <MoviesPage/>},
            {path: 'movies/:movieId', element: <MovieInfoPage/>},
            {path: 'movies/:movieId/video', element: <VideoPage/>},
            {path: 'movies/genre/:genreId', element: <MoviesOfGenrePage/>},
            {path: 'movies/search', element: <MoviesFoundPage/>}
        ]
    }
]);

export {router};