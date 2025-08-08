import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import type {TrendingItem} from "@/components/Widgets/TrendingCard.tsx";
import type {IGlobalData} from "@/pages/Crypto/CryptoList.tsx";
import {AppConstants} from "@/utils/app.util.ts";
import axios from "axios";
import type {ICoinMarketData, ICrypto} from "@/pages/Crypto/Crypto.Types.ts";
import {Avatar, Box, Typography} from "@mui/material";
import type {Column} from "@/components/Table/table.types.ts";

export const CRYPTO_COLUMNS: {[key: string]: Column<ICoinMarketData>} = {
    id: {
        id: 'id',
        label: '#',
        sortable: false,
        searchable: false,
        render: (_, __, rowIndex) => rowIndex + 1
    },
    name: {
        id: 'name',
        label: 'Name',
        sortable: true,
        searchable: true,
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
        render:(value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number(value))
    },
    market_cap_rank: {
        id: 'market_cap_rank',
        label: 'Rank',
        sortable: true,
        searchable: true
    },
    total_volume: {
        id: 'total_volume',
        label: 'Volume',
        sortable: true,
        searchable: true,
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
        searchable: true
    },
    ath_change_percentage: {
        id: 'ath_change_percentage',
        label: 'ATH % Down',
        sortable: true,
        searchable: false,
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
        searchable: true
    },
    atl_change_percentage: {
        id: 'atl_change_percentage',
        label: 'ATL % Up',
        sortable: true,
        searchable: false,
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

export const DEMO_DATA = [
    {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "image": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
        "current_price": 114589,
        "market_cap": 2281522075684,
        "market_cap_rank": 1,
        "fully_diluted_valuation": 2281522075684,
        "total_volume": 31492029930,
        "high_24h": 115663,
        "low_24h": 113400,
        "price_change_24h": 1135.53,
        "price_change_percentage_24h": 1.00088,
        "market_cap_change_24h": 24112346747,
        "market_cap_change_percentage_24h": 1.06814,
        "circulating_supply": 19902915.0,
        "total_supply": 19902915.0,
        "max_supply": 21000000.0,
        "ath": 122838,
        "ath_change_percentage": -6.71522,
        "ath_date": "2025-07-14T07:56:01.937Z",
        "atl": 67.81,
        "atl_change_percentage": 168888.10312,
        "atl_date": "2013-07-06T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.629Z"
    },
    {
        "id": "ethereum",
        "symbol": "eth",
        "name": "Ethereum",
        "image": "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
        "current_price": 3664.61,
        "market_cap": 442358606394,
        "market_cap_rank": 2,
        "fully_diluted_valuation": 442358606394,
        "total_volume": 22990412461,
        "high_24h": 3698.18,
        "low_24h": 3573.77,
        "price_change_24h": 87.21,
        "price_change_percentage_24h": 2.43772,
        "market_cap_change_24h": 10769936864,
        "market_cap_change_percentage_24h": 2.49542,
        "circulating_supply": 120709318.9828206,
        "total_supply": 120709318.9828206,
        "max_supply": null,
        "ath": 4878.26,
        "ath_change_percentage": -24.87863,
        "ath_date": "2021-11-10T14:24:19.604Z",
        "atl": 0.432979,
        "atl_change_percentage": 846272.97731,
        "atl_date": "2015-10-20T00:00:00.000Z",
        "roi": {
            "times": 41.76717361879083,
            "currency": "btc",
            "percentage": 4176.717361879083
        },
        "last_updated": "2025-08-07T04:20:44.190Z"
    },
    {
        "id": "ripple",
        "symbol": "xrp",
        "name": "XRP",
        "image": "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442",
        "current_price": 2.97,
        "market_cap": 176410934194,
        "market_cap_rank": 3,
        "fully_diluted_valuation": 297404866297,
        "total_volume": 3880460564,
        "high_24h": 3.01,
        "low_24h": 2.91,
        "price_change_24h": 0.059955,
        "price_change_percentage_24h": 2.05722,
        "market_cap_change_24h": 3853695417,
        "market_cap_change_percentage_24h": 2.23329,
        "circulating_supply": 59308385925.0,
        "total_supply": 99985880506.0,
        "max_supply": 100000000000.0,
        "ath": 3.65,
        "ath_change_percentage": -18.43116,
        "ath_date": "2025-07-18T03:40:53.808Z",
        "atl": 0.00268621,
        "atl_change_percentage": 110625.22379,
        "atl_date": "2014-05-22T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.495Z"
    },
    {
        "id": "tether",
        "symbol": "usdt",
        "name": "Tether",
        "image": "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661",
        "current_price": 1.0,
        "market_cap": 164054489822,
        "market_cap_rank": 4,
        "fully_diluted_valuation": 164054489822,
        "total_volume": 60275397066,
        "high_24h": 1.0,
        "low_24h": 0.999839,
        "price_change_24h": 0.00017061,
        "price_change_percentage_24h": 0.01706,
        "market_cap_change_24h": 176405251,
        "market_cap_change_percentage_24h": 0.10764,
        "circulating_supply": 164039701141.8069,
        "total_supply": 164039701141.8069,
        "max_supply": null,
        "ath": 1.32,
        "ath_change_percentage": -24.41376,
        "ath_date": "2018-07-24T00:00:00.000Z",
        "atl": 0.572521,
        "atl_change_percentage": 74.67971,
        "atl_date": "2015-03-02T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.966Z"
    },
    {
        "id": "binancecoin",
        "symbol": "bnb",
        "name": "BNB",
        "image": "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970",
        "current_price": 766.34,
        "market_cap": 106747702991,
        "market_cap_rank": 5,
        "fully_diluted_valuation": 106747702991,
        "total_volume": 950861923,
        "high_24h": 774.49,
        "low_24h": 748.97,
        "price_change_24h": 17.37,
        "price_change_percentage_24h": 2.31884,
        "market_cap_change_24h": 2476357668,
        "market_cap_change_percentage_24h": 2.37492,
        "circulating_supply": 139288150.56,
        "total_supply": 139288150.56,
        "max_supply": 200000000.0,
        "ath": 858.34,
        "ath_change_percentage": -10.71807,
        "ath_date": "2025-07-28T09:36:43.658Z",
        "atl": 0.0398177,
        "atl_change_percentage": 1924522.82244,
        "atl_date": "2017-10-19T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.409Z"
    },
    {
        "id": "solana",
        "symbol": "sol",
        "name": "Solana",
        "image": "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
        "current_price": 167.18,
        "market_cap": 90121373801,
        "market_cap_rank": 6,
        "fully_diluted_valuation": 101449556706,
        "total_volume": 3804510221,
        "high_24h": 169.59,
        "low_24h": 161.52,
        "price_change_24h": 5.66,
        "price_change_percentage_24h": 3.50606,
        "market_cap_change_24h": 3182238475,
        "market_cap_change_percentage_24h": 3.66031,
        "circulating_supply": 539132866.7808532,
        "total_supply": 606901426.7489758,
        "max_supply": null,
        "ath": 293.31,
        "ath_change_percentage": -43.06293,
        "ath_date": "2025-01-19T11:15:27.957Z",
        "atl": 0.500801,
        "atl_change_percentage": 33247.21157,
        "atl_date": "2020-05-11T19:35:23.449Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.402Z"
    },
    {
        "id": "usd-coin",
        "symbol": "usdc",
        "name": "USDC",
        "image": "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
        "current_price": 0.999759,
        "market_cap": 64669518937,
        "market_cap_rank": 7,
        "fully_diluted_valuation": 64666352204,
        "total_volume": 11109626731,
        "high_24h": 0.999847,
        "low_24h": 0.999702,
        "price_change_24h": 5.075e-05,
        "price_change_percentage_24h": 0.00508,
        "market_cap_change_24h": 86593289,
        "market_cap_change_percentage_24h": 0.13408,
        "circulating_supply": 64682764323.34347,
        "total_supply": 64679596942.41328,
        "max_supply": null,
        "ath": 1.17,
        "ath_change_percentage": -14.74561,
        "ath_date": "2019-05-08T00:40:28.300Z",
        "atl": 0.877647,
        "atl_change_percentage": 13.91641,
        "atl_date": "2023-03-11T08:02:13.981Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.433Z"
    },
    {
        "id": "staked-ether",
        "symbol": "steth",
        "name": "Lido Staked Ether",
        "image": "https://coin-images.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206",
        "current_price": 3659.0,
        "market_cap": 32509993779,
        "market_cap_rank": 8,
        "fully_diluted_valuation": 32509993779,
        "total_volume": 40954041,
        "high_24h": 3705.57,
        "low_24h": 3569.58,
        "price_change_24h": 88.82,
        "price_change_percentage_24h": 2.48794,
        "market_cap_change_24h": 753735913,
        "market_cap_change_percentage_24h": 2.3735,
        "circulating_supply": 8883350.315081552,
        "total_supply": 8883350.315081552,
        "max_supply": null,
        "ath": 4829.57,
        "ath_change_percentage": -24.3741,
        "ath_date": "2021-11-10T14:40:47.256Z",
        "atl": 482.9,
        "atl_change_percentage": 656.35433,
        "atl_date": "2020-12-22T04:08:21.854Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.012Z"
    },
    {
        "id": "tron",
        "symbol": "trx",
        "name": "TRON",
        "image": "https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193",
        "current_price": 0.338949,
        "market_cap": 32116566430,
        "market_cap_rank": 9,
        "fully_diluted_valuation": 32116634682,
        "total_volume": 816772438,
        "high_24h": 0.33924,
        "low_24h": 0.331814,
        "price_change_24h": 0.00705709,
        "price_change_percentage_24h": 2.12632,
        "market_cap_change_24h": 683486388,
        "market_cap_change_percentage_24h": 2.17442,
        "circulating_supply": 94703540108.40967,
        "total_supply": 94703741365.56866,
        "max_supply": null,
        "ath": 0.431288,
        "ath_change_percentage": -21.41009,
        "ath_date": "2024-12-04T00:10:40.323Z",
        "atl": 0.00180434,
        "atl_change_percentage": 18685.19765,
        "atl_date": "2017-11-12T00:00:00.000Z",
        "roi": {
            "times": 177.3942854060132,
            "currency": "usd",
            "percentage": 17739.428540601322
        },
        "last_updated": "2025-08-07T04:20:44.690Z"
    },
    {
        "id": "dogecoin",
        "symbol": "doge",
        "name": "Dogecoin",
        "image": "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409",
        "current_price": 0.204543,
        "market_cap": 30746918051,
        "market_cap_rank": 10,
        "fully_diluted_valuation": 30751178656,
        "total_volume": 1169102816,
        "high_24h": 0.206967,
        "low_24h": 0.196205,
        "price_change_24h": 0.00833778,
        "price_change_percentage_24h": 4.24952,
        "market_cap_change_24h": 1282576475,
        "market_cap_change_percentage_24h": 4.35298,
        "circulating_supply": 150393156383.7052,
        "total_supply": 150413996383.7052,
        "max_supply": null,
        "ath": 0.731578,
        "ath_change_percentage": -72.03712,
        "ath_date": "2021-05-08T05:08:23.458Z",
        "atl": 8.69e-05,
        "atl_change_percentage": 235298.66015,
        "atl_date": "2015-05-06T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-08-07T04:20:43.400Z"
    }
]

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
    fetchGlobalMarket:() => axios.get(`${AppConstants.apiBasePath}/global`),
    fetchTrendingData:() => axios.get(`${AppConstants.apiBasePath}/search/trending`),
    fetchExchangeData:() => axios.get(`${AppConstants.apiBasePath}/exchanges`),
    fetchCryptoList: (params: {[key: string]: any}) => axios.get(`${AppConstants.apiBasePath}/coins/markets`, params),
    fetchCryptoDetail: (id: string) => axios.get<ICrypto>(`${AppConstants.apiBasePath}/coins/${id}`),
    fetchCryptoMarketChart: (id: string, params: {[key: string]: any}) => axios.get(`${AppConstants.apiBasePath}/coins/${id}/market_chart`, params)
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