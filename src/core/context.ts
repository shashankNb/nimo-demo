import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type IState = {
    auth: {email: string | null, name: string | null}
}

export interface stateContextType {
    state: IState;
    setState: Dispatch<SetStateAction<IState>>;
}

export const stateContext = createContext<stateContextType | undefined>({
    state: null,
    setState: useStateContext,
});

export function useStateContext() {
    const ctx = useContext(stateContext);
    if (!ctx) throw new Error("useStateContext must be used within a StateContext.Provider");
    return ctx;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>({
    isAuthenticated: false,
    userHasAuthenticated: useAuthContext,
});

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within an AuthContext.Provider");
    return ctx;
}

export interface LoaderContextType {
    preLoader: boolean;
    setPreLoader: Dispatch<SetStateAction<boolean>>;
}

export const LoaderContext = createContext<LoaderContextType | undefined>({
    preLoader: false,
    setPreLoader: useLoaderContext,
});

export function useLoaderContext(): LoaderContextType {
    const ctx = useContext(LoaderContext);
    if (!ctx) throw new Error("useLoaderContext must be used within a LoaderContext.Provider");
    return ctx;
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
    const ctx = useContext(HistoryContext);
    if (!ctx) throw new Error("useHistoryContext must be used within a HistoryContext.Provider");
    return ctx;
}