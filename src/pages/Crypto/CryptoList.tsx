import MuiTableHOC from "@/components/Table/MuiTableHoc.tsx";
import React, {useEffect, useState} from "react";
import Status, {type ComponentInfo, DataStatus} from "@/components/Status/Status.tsx";
import {CRYPTO_COLUMNS, CryptoAPI, CryptoConstants, CryptoUtil, DEMO_DATA} from "@/pages/Crypto/CryptoAPI.tsx";
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';
import {Avatar, Box, Card, CardContent, Chip, Grid, Typography} from "@mui/material";
import TrendingCard, {type TrendingItem} from "@/components/Widgets/TrendingCard.tsx";
import {type AxiosError, type AxiosResponse} from 'axios';
import {formatNumber} from "@/utils/app.util.ts";
import TrendingUp from '@mui/icons-material/TrendingUp'
import {useNavigate} from "react-router-dom";
import type {Column} from "@/components/Table/table.types.ts";
import type {ICoinMarketData} from "@/pages/Crypto/Crypto.Types.ts";

interface ComponentState {
    columns: Column<ICoinMarketData>[],
    data: any[],
    trendingList: TrendingItem[],
    exchangeList: TrendingItem[],
    globalData: IGlobalData
}

export interface IGlobalData {
    market_cap_usd: number;
    volume_usd: number;
    market_cap_change_percentage_24h: number;
    active_cryptocurrencies: number;
}

const CryptoList = () => {

    const navigate = useNavigate();

    const [componentState, setComponentState] = useState<ComponentState>({
        columns: [],
        data: DEMO_DATA,
        trendingList: [],
        exchangeList: [],
        globalData: null
    });

    const [tableComponentInfo, setTableComponentInfo] = useState<ComponentInfo>({
        callback: () => fetchCryptoList(),
        status: DataStatus.Loaded
    });
    const [globalCompInfo, setGlobalCompInfo] = useState<ComponentInfo>({
        callback: () => fetchGlobalData(),
        status: DataStatus.Loaded
    })
    const [trendCompInfo, setTrendCompInfo] = useState<ComponentInfo>({
        callback: () => fetchTrending(),
        status: DataStatus.Loaded
    });
    const [exchangeCompInfo, setExchangeCompInfo] = useState<ComponentInfo>({
        callback: () => fetchExchange(),
        status: DataStatus.Loaded
    });

    const buildColumns = () => {
        const columns: { [key: string]: Column<ICoinMarketData> } = CRYPTO_COLUMNS;
        columns.name = {
            ...columns.name,
            render: (value, row) => <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{ display: 'flex', alignItems: 'end', gap: 1}}>
                    <Avatar alt={row.name} src={row.image} style={{  width: 24, height: 'auto' }}/>
                    <Typography style={{ cursor: 'pointer'}} onClick={() => navigate(`/detail/${row.id}`)}><strong>{value}</strong></Typography>
                    <Typography variant={'caption'}>{row.symbol.toUpperCase()}</Typography>
                </Box>
                <Chip label="View" color={'success'} size={'small'} variant="filled" onClick={() => navigate(`/detail/${row.id}`)}/>
            </Box>
        }
        return Object.keys(columns).map(key => columns[key]);
    }

    const fetchGlobalData = () => {
        setGlobalCompInfo(prev => ({...prev, status: DataStatus.Loading}));
        CryptoAPI.fetchGlobalMarket().then((response: AxiosResponse) => {
            const globalMarketData = CryptoUtil.prepareGlobalMarketPayload(response.data);
            setComponentState(prev => ({...prev, globalData: globalMarketData}))
            setGlobalCompInfo(prev => ({...prev, status: DataStatus.Loaded}));
        }).catch((err: AxiosError) => {
            console.log(err);
            setGlobalCompInfo(prev => ({...prev, status: DataStatus.ErrorState}))
        })
    }

    const fetchExchange = () => {
        setExchangeCompInfo(prev => ({...prev, status: DataStatus.Loading}));
        CryptoAPI.fetchExchangeData().then((response: AxiosResponse) => {
            const trendingList = CryptoUtil.prepareExchangePayload(response.data);
            setComponentState(prev => ({...prev, exchangeList: trendingList}))
            setExchangeCompInfo(prev => ({...prev, status: DataStatus.Loaded}));
        }).catch((err: AxiosError) => {
            console.log(err);
            setExchangeCompInfo(prev => ({...prev, status: DataStatus.ErrorState}))
        })
    }

    const fetchTrending = () => {
        setTrendCompInfo(prev => ({...prev, status: DataStatus.Loading}));
        CryptoAPI.fetchTrendingData().then((response: AxiosResponse) => {
            const trendingList = CryptoUtil.prepareTrendingPayload(response.data);
            setComponentState(prev => ({...prev, trendingList}))
            setTrendCompInfo(prev => ({...prev, status: DataStatus.Loaded}));
        }).catch((err: AxiosError) => {
            console.log(err);
            setTrendCompInfo(prev => ({...prev, status: DataStatus.ErrorState}))
        });
    }

    const fetchCryptoList = () => {
        setTableComponentInfo(prev => ({...prev, status: DataStatus.Loading}));
        CryptoAPI.fetchCryptoList(CryptoConstants.coinsListConfig).then((response: AxiosResponse) => {
            setComponentState(prev => ({...prev, data: response.data }));
            setTableComponentInfo(prev => ({...prev, status: DataStatus.Loaded}));
        }).catch((err: AxiosError) => {
            console.log(err);
            setTableComponentInfo(prev => ({...prev, status: DataStatus.ErrorState }));
        })
    }

    useEffect(() => {
        fetchGlobalData();
        fetchExchange();
        fetchTrending();
        fetchCryptoList();
    }, [])
    return <>
        <Box marginBottom={4}>
            <Typography variant={'h4'} fontWeight={'500'}>Crypto Currency Prices By Market Cap</Typography>
            <Typography variant={'caption'}>The data of global cryptocurrency market cap today.</Typography>
        </Box>
        <Grid container spacing={2} marginBottom={2}>
            <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{border: '2px solid #efefef', borderRadius: 5, boxShadow: 'none'}}>
                        <Status componentInfos={[globalCompInfo]} showRetry={true}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography fontWeight={600} fontSize={20} display="flex" alignItems="center">
                                        <TrendingUp fontSize="small" sx={{color: 'orange', mr: 1}}/>
                                         Global Market
                                    </Typography>
                                </Box>
                                {
                                    componentState.globalData != null
                                        ? <>
                                            <Box sx={{mb: 1}}>
                                                <Typography variant="body2" color="text.secondary">24h Volume</Typography>
                                                <Typography variant="h6">{formatNumber(componentState.globalData.volume_usd)}</Typography>
                                            </Box>

                                            <Box sx={{mb: 1}}>
                                                <Typography variant="body2" color="text.secondary">24h Market Cap Change</Typography>
                                                <Typography
                                                    variant="h6"
                                                    color={componentState.globalData.market_cap_change_percentage_24h >= 0 ? 'success.main' : 'error.main'}>
                                                    {componentState.globalData.market_cap_change_percentage_24h.toFixed(2)}%
                                                </Typography>
                                            </Box>
                                        </>
                                        : <></>
                                }
                            </CardContent>
                        </Status>
                    </Card>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
                <Status componentInfos={[trendCompInfo]} showRetry={true}>
                    <TrendingCard cardTitle={'Trending'}
                                  data={componentState.trendingList}
                                  valueType={'DOLLAR'}
                                  CardIcon={<LocalFireDepartment sx={{color: 'orange', mr: 1}}/>}></TrendingCard>
                </Status>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
                <Status componentInfos={[exchangeCompInfo]} showRetry={true}>
                    <TrendingCard cardTitle={'Exchange'}
                                  data={componentState.exchangeList}
                                  valueType={'DOLLAR'}
                                  CardIcon={<CurrencyExchange sx={{color: 'orange', mr: 1}}/>}></TrendingCard>
                </Status>
            </Grid>
        </Grid>
        <MuiTableHOC componentInfos={[tableComponentInfo]} columns={buildColumns()}
                     data={componentState.data}></MuiTableHOC>
    </>
}

export default CryptoList;