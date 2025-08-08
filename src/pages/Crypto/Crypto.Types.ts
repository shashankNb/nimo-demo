import React from "react";

export type CryptoChartProps = {
    data: IHistoryItem[];
    gradientId: string;
    stopColor: string;
    lineColor: string;
}

export type MarketInfoItemProps = {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

export interface IUseCryptoDataState {
    crypto: ICrypto | null;
    history: IHistoryItem[];
}

export interface IHistoryItem {
    date: string;
    price: number;
}

export interface ICrypto {
    image: { large: string };
    name: string;
    symbol: string;
    market_data: IMarketData;
    hashing_algorithm: string | null;
    description: { en: string };
    categories: string[];
    links: { homepage: string[] };
}

export interface IMarketData {
    current_price: { usd: number };
    market_cap: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
}

export interface ICoinMarketData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null;
    last_updated: string;
}