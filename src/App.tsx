import {type Dispatch, lazy, type SetStateAction, Suspense, useEffect, useMemo, useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {MainRoutes} from "@/routes/MainRoute.tsx";
import AuthenticatedRoute from "@/routes/AuthenticatedRoute.tsx";
import UnauthenticatedRoute from "@/routes/UnauthenticatedRoute.tsx";
import Loading from "@/components/Loaders/Loading.tsx";
import {
    AuthContext,
    stateContext,
    type AuthContextType, type IState,
    LoaderContext,
    type LoaderContextType, type stateContextType,
} from "@/core/context.ts";
import './App.css';
import {HistoryProvider} from "@/providers/HistoryProvider.tsx";

const MainLayout = lazy(() => import("./components/Layouts/MainLayout.tsx"));

const useInitialAppLoad = (setState: Dispatch<SetStateAction<IState>>) => {
    const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = () => {
            const loginKey = localStorage.getItem("LOGIN_KEY");
            if (loginKey === import.meta.env.VITE_USER_NAME) {
                setState(prevState => ({
                    ...prevState,
                    auth: {email: import.meta.env.VITE_USER_NAME, name: 'Demo User'}
                }));
                userHasAuthenticated(true);
            } else {
                userHasAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    return {isAuthenticated, userHasAuthenticated};
};

const App = () => {
    const [state, setState] = useState<IState>({ auth: { email: null, name: null }});
    const {isAuthenticated, userHasAuthenticated} = useInitialAppLoad(setState);
    const [preLoader, setPreLoader] = useState<boolean>(false);

    const AuthVal = useMemo(() => ({ isAuthenticated, userHasAuthenticated }), [isAuthenticated, userHasAuthenticated]);
    const StateVal = useMemo(() => ({ state, setState }), [state]);
    const PreLoaderVal = useMemo(() => ({ preLoader, setPreLoader }), [preLoader]);


    const appRoutes = useMemo(() =>
            MainRoutes.map((route, index) => {
                const path = route.path.split("?")[0];
                const element = (
                    <Suspense fallback={<Loading/>}>
                        <route.component/>
                    </Suspense>
                );

                if (route.authenticatedRoute) {
                    return (
                        <Route key={index}
                               path={path}
                               element={
                                   <AuthenticatedRoute>
                                       <MainLayout>
                                           {element}
                                       </MainLayout>
                                   </AuthenticatedRoute>
                               }
                        />
                    );
                } else {
                    return (
                        <Route key={index}
                               path={path}
                               element={
                                   <UnauthenticatedRoute>
                                       {element}
                                   </UnauthenticatedRoute>
                               }
                        />
                    );
                }
            })
        , [MainRoutes]);

    return (
        <>
            <AuthContext.Provider value={AuthVal}>
                <stateContext.Provider value={StateVal}>
                    <LoaderContext.Provider value={PreLoaderVal}>
                        <HistoryProvider>
                            <Routes>
                                {appRoutes}
                            </Routes>
                        </HistoryProvider>
                    </LoaderContext.Provider>
                </stateContext.Provider>
            </AuthContext.Provider>
            {preLoader && <Loading></Loading>}
        </>
    );
};

export default App;