import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import {Route, Routes} from "react-router-dom";
import {MainRoutes} from "@/routes/MainRoute.tsx";
import AuthenticatedRoute from "@/routes/AuthenticatedRoute.tsx";
import UnauthenticatedRoute from "@/routes/UnauthenticatedRoute.tsx";
import Loading from "@/components/Loaders/Loading.tsx";
import {
    AuthContext,
    type AuthContextType,
    LoaderContext,
    type LoaderContextType,
} from "@/core/context.ts";
import './App.css';
import {HistoryProvider} from "@/providers/HistoryProvider.tsx";

const MainLayout = lazy(() => import("./components/Layouts/MainLayout.tsx"));

const useInitialAppLoad = () => {
    const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = () => {
            const loginKey = localStorage.getItem("LOGIN_KEY");
            if (loginKey === import.meta.env.VITE_USER_NAME) {
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
    const {isAuthenticated, userHasAuthenticated} = useInitialAppLoad();
    const [preLoader, setPreLoader] = useState<boolean>(false);

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
        , []);

    return (
        <>
            <AuthContext.Provider value={{isAuthenticated, userHasAuthenticated} as AuthContextType}>
                <LoaderContext.Provider value={{preLoader, setPreLoader} as LoaderContextType}>
                    <HistoryProvider>
                        <Routes>
                            {appRoutes}
                        </Routes>
                    </HistoryProvider>
                </LoaderContext.Provider>
            </AuthContext.Provider>
            {preLoader && <Loading></Loading>}
        </>
    );
};

export default App;