import {useLocation, Location} from "react-router-dom";

export const useAppLocation = <T>(): Location<T> => useLocation();