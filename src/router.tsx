import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts";
import {MoviesPage} from "./pages";

let router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to='movies'/>},
            {path: 'movies', element: <MoviesPage/>}
        ]
    }
]);

export {router};