import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export interface AuthContextType {
    isAuthenticated: boolean;
    userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    userHasAuthenticated: useAuthContext,
});

export function useAuthContext() {
    return useContext(AuthContext);
}

export interface LoaderContextType {
    preLoader: any;
    setPreLoader: Dispatch<SetStateAction<boolean>>;
}

export const LoaderContext = createContext<LoaderContextType>({
    preLoader: null,
    setPreLoader: useLoaderContext,
});

export function useLoaderContext() {
    return useContext(LoaderContext);
}