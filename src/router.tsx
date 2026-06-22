import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts";
import {
    ExplorePage,
    MoviesFoundPage,
    MoviesOfGenrePage,
    MoviesPage,
    TmdbDetailPage,
    TmdbEntityDetailPage,
    VideoPage
} from "./pages";

let router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to='movies'/>},
            {path: 'movies', element: <MoviesPage/>},
            {path: 'movies/:movieId', element: <TmdbDetailPage mediaType="movie"/>},
            {path: 'movies/:movieId/video', element: <VideoPage/>},
            {path: 'movies/genre/:genreId', element: <MoviesOfGenrePage/>},
            {path: 'movies/search', element: <MoviesFoundPage/>},
            {path: 'explore/:section/:endpoint', element: <ExplorePage/>},
            {path: 'movie/:id', element: <TmdbDetailPage mediaType="movie"/>},
            {path: 'tv/:id', element: <TmdbDetailPage mediaType="tv"/>},
            {path: 'person/:id', element: <TmdbDetailPage mediaType="person"/>},
            {path: 'collection/:id', element: <TmdbEntityDetailPage entityType="collection"/>},
            {path: 'company/:id', element: <TmdbEntityDetailPage entityType="company"/>},
            {path: 'keyword/:id', element: <TmdbEntityDetailPage entityType="keyword"/>}
        ]
    }
]);

export {router};
