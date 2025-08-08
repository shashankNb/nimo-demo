
import {lazy} from "react";

export interface Routes {
    key: string;
    path: string;
    name: string;
    component: any,
    views?: Routes[],
    authenticatedRoute: boolean,
}

export const MainRoutes: Routes[] = [
    {
        key: 'crypto-list',
        path: '/',
        name: 'Crypto List',
        component: lazy(() => import('../pages/Crypto/CryptoList')),
        authenticatedRoute: true
    },
    {
        key: 'crypto-detail',
        path: '/detail/:cryptoId',
        name: 'Dashboard',
        component: lazy(() => import('../pages/Crypto/CryptoDetail')),
        authenticatedRoute: true
    },
    {
        key: 'auth-login',
        path: '/auth/login',
        name: 'Login',
        component: lazy(() => import('../pages/Auth/Login')),
        authenticatedRoute: false
    },
];
