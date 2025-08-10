import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type IState = {
    auth: {email: string, name: string}
}

export interface stateContextType {
    state: IState;
    setState: Dispatch<SetStateAction<IState>>;
}

export const stateContext = createContext<stateContextType>({
    state: null,
    setState: useStateContext,
});

export function useStateContext() {
    return useContext(stateContext);
}

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

export interface HistoryContextType {
    history: string[];
    pushHistory: (page: string) => void;
    goBack: () => void;
    getCurrentPage: () => string;
}

export const HistoryContext = createContext<HistoryContextType | undefined>({
    history: ['/'],
    pushHistory: () => {},
    goBack: () => {},
    getCurrentPage: () => '/',
});

export function useHistoryContext() {
    return useContext(HistoryContext);
}