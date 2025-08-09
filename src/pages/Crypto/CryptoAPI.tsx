import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import type {TrendingItem} from "@/components/Widgets/TrendingCard.tsx";
import type {IGlobalData} from "@/pages/Crypto/CryptoList.tsx";
import type {ICoinMarketData, ICrypto} from "@/pages/Crypto/Crypto.Types.ts";
import {Avatar, Box, Typography} from "@mui/material";
import type {Column} from "@/components/Table/table.types.ts";
import _axios from "@/core/api.interceptor.ts";

export const CRYPTO_COLUMNS: {[key: string]: Column<ICoinMarketData>} = {
    id: {
        id: 'id',
        label: '#',
        sortable: false,
        searchable: false,
        align: 'center',
        render: (_, __, rowIndex) => rowIndex + 1
    },
    name: {
        id: 'name',
        label: 'Name',
        sortable: true,
        searchable: true,
        align: 'left',
        render: (value, row) => <Box sx={{ display: 'flex', alignItems: 'end', gap: 1}}>
            <Avatar alt={row.name} src={row.image} style={{  width: 24, height: 'auto' }}/>
            <Typography><strong>{value}</strong></Typography>
            <Typography variant={'caption'}>{row.symbol.toUpperCase()}</Typography>

        </Box>
    },
    current_price: {
        id: 'current_price',
        label: 'Price',
        sortable: true,
        searchable: true,
        align: 'right',
        render:(value: number) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(value))
    },
    market_cap: {
        id: 'market_cap',
        label: 'Market Cap',
        sortable: true,
        searchable: true,
        align: 'right',
        render:(value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(value))
    },
    market_cap_rank: {
        id: 'market_cap_rank',
        label: 'Rank',
        sortable: true,
        searchable: true,
        align: 'center'
    },
    total_volume: {
        id: 'total_volume',
        label: 'Volume',
        sortable: true,
        searchable: true,
        align: 'right',
        render:(value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(value))
    },
    price_change_percentage_24h: {
        id: 'price_change_percentage_24h',
        label: '24h %',
        sortable: true,
        searchable: false,
        align: 'right',
        render: (value) => {
            const isPositive = value > 0;
            const color = isPositive ? 'green' : 'red';
            const Icon = isPositive ? ArrowDropUp : ArrowDropDown;

            return (
                <div style={{ color, display: 'flex', alignItems: 'center' }}>
                    <Icon />
                    <span>{value.toFixed(2)} %</span>
                </div>
            );
        }
    },
    ath: {
        id: 'ath',
        label: 'All Time High',
        sortable: true,
        align: 'right',
        searchable: true
    },
    ath_change_percentage: {
        id: 'ath_change_percentage',
        label: 'ATH % Down',
        sortable: true,
        searchable: false,
        align: 'right',
        render: (value) => {
            const isPositive = value > 0;
            const color = isPositive ? 'green' : 'red';
            const Icon = isPositive ? ArrowDropUp : ArrowDropDown;

            return (
                <div style={{ color, display: 'flex', alignItems: 'center' }}>
                    <Icon />
                    <span>{value.toFixed(2)} %</span>
                </div>
            );
        }
    },
    atl: {
        id: 'atl',
        label: 'All Time Low',
        sortable: true,
        searchable: true,
        align: 'right',
    },
    atl_change_percentage: {
        id: 'atl_change_percentage',
        label: 'ATL % Up',
        sortable: true,
        searchable: false,
        align: 'right',
        render: (value, row) => {
            const isPositive = value < 0;
            const color = isPositive ? 'green' : 'red';
            const Icon = !isPositive ? ArrowDropUp : ArrowDropDown;

            const d = ((row.current_price - value) / value) * 100
            return (
                <div style={{ color, display: 'flex', alignItems: 'center' }}>
                    <Icon />
                    <span>{d.toFixed(2)} %</span>
                </div>
            );
        }
    }
}

export const CryptoConstants = {
    coinsListConfig: {
        params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
        }
    }
}

export const CryptoAPI = {
    fetchGlobalMarket:() => _axios.get(`/global`),
    fetchTrendingData:() => _axios.get(`/search/trending`),
    fetchExchangeData:() => _axios.get(`/exchanges`),
    fetchCryptoList: (params: {[key: string]: any}) => _axios.get(`/coins/markets`, params),
    fetchCryptoDetail: (id: string) => _axios.get<ICrypto>(`/coins/${id}`),
    fetchCryptoMarketChart: (id: string, params: {[key: string]: any}) => _axios.get(`/coins/${id}/market_chart`, params)
}

export const CryptoUtil = {
    prepareTrendingPayload: (data: {coins: any[]}): TrendingItem[] => {
        return data.coins.slice(0, 3).map(d => ({
            title: d.item.name,
            value: d.item.data.price_change_percentage_24h.aud,
            percentage: d.item.data.price.toFixed(2),
            icon: d.item.small
        }));
    },
    prepareExchangePayload: (data: any[]): TrendingItem[] => {
        return data.slice(0, 3).map(d => ({
            title: d.name,
            value: d.trade_volume_24h_btc,
            percentage: 0,
            icon: d.image
        }));
    },
    prepareGlobalMarketPayload: (raw: any): IGlobalData => {
        return {
            market_cap_usd: raw.data.total_market_cap.usd,
            volume_usd: raw.data.total_volume.usd,
            market_cap_change_percentage_24h: raw.data.market_cap_change_percentage_24h_usd,
            active_cryptocurrencies: raw.data.active_cryptocurrencies,
        }
    }
}