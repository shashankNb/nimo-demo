import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HistoryContext, useLoaderContext } from '@/core/context.ts';

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [history, setHistory] = useState<string[]>(() => [location.pathname]);
    const { setPreLoader } = useLoaderContext();

    const pushHistory = useCallback((page: string) => {
        setHistory((prevHistory) => {
            if (prevHistory[prevHistory.length - 1] === page) {
                return prevHistory;
            }
            return [...prevHistory, page];
        });
    }, []);

    const popHistory = useCallback(() => {
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    }, []);

    const goBack = useCallback(() => {
        setPreLoader(true);
        popHistory();
    }, [setPreLoader, popHistory]);

    const getCurrentPage = useCallback(() => {
        return history[history.length - 1] || '';
    }, [history]);

    useEffect(() => {
        const currentPage = history[history.length - 1];
        if (currentPage !== location.pathname && !location.pathname.startsWith('/auth/')) {
            pushHistory(location.pathname);
        }
    }, [location.pathname]);

    const contextValue = useMemo(() => ({
        history,
        pushHistory,
        goBack,
        getCurrentPage
    }), [history, pushHistory, goBack, getCurrentPage]);

    return (
        <HistoryContext.Provider value={contextValue}>
            {children}
        </HistoryContext.Provider>
    );
};
