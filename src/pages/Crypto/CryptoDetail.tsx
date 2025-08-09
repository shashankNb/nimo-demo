import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Avatar,
    Box,
    Card,
    Chip,
    Divider,
    Paper,
    Stack,
    styled,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CachedIcon from '@mui/icons-material/Cached';
import FunctionsIcon from '@mui/icons-material/Functions';
import NumbersIcon from '@mui/icons-material/Numbers';
import type {CryptoChartProps, IUseCryptoDataState, MarketInfoItemProps} from "@/pages/Crypto/Crypto.Types.ts";
import {useParams} from "react-router-dom";
import Status, {type ComponentInfo, DataStatus} from "@/components/Status/Status.tsx";
import {CryptoAPI} from "@/pages/Crypto/CryptoAPI.tsx";

const StyledCard = styled(Card)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
}));

const SectionTitle = styled(Typography)(({theme}) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1),
}));

const InfoLabel = styled(Typography)(({theme}) => ({
    fontWeight: 500,
    color: theme.palette.text.secondary,
}));

const MarketInfoItem: React.FC<MarketInfoItemProps> = ({label, value, icon, color}) => (
    <Box sx={{width: {xs: '100%', sm: '80%'}}}>
        <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{color: color}}>{icon}</Box>
            <Typography variant="body2" fontWeight={600}>{label}:</Typography>
            <Typography variant="body2" color="text.secondary">{value}</Typography>
        </Stack>
    </Box>
);

const CryptoChart: React.FC<CryptoChartProps> = ({data, gradientId, stopColor, lineColor}) => (
    <Paper elevation={3}
           sx={{height: 320, p: 2, borderRadius: 3, background: '#fdfdfd', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{top: 20, right: 20, left: 10, bottom: 5}}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stopColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                <XAxis dataKey="date"
                       tick={{fontSize: 12}}
                       tickLine={false}
                       axisLine={{stroke: '#e0e0e0'}}
                       hide={data.length > 20}/>
                <YAxis domain={['auto', 'auto']}
                       tickFormatter={(val) => `$${val.toLocaleString()}`}
                       tick={{fontSize: 12}}
                       tickLine={false}
                       axisLine={{stroke: '#e0e0e0'}}/>
                <Tooltip contentStyle={{
                    borderRadius: 8,
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)'
                }}
                         labelStyle={{fontWeight: 600, color: '#555'}}
                         formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}/>
                <Line type="monotone"
                      dataKey="price"
                      stroke={lineColor}
                      strokeWidth={3}
                      dot={{r: 2, stroke: lineColor, strokeWidth: 1, fill: '#fff'}}
                      activeDot={{r: 5}}
                      animationDuration={500}/>
                {/*<Area type="monotone" dataKey="price" stroke={'0'} fill={`url(#${gradientId})`}/>*/}
            </LineChart>
        </ResponsiveContainer>
    </Paper>
);

const useCryptoData = (coinId: string, days: string, setComponentInfo: React.Dispatch<React.SetStateAction<ComponentInfo>>) => {
    const [state, setState] = useState<IUseCryptoDataState>({
        crypto: null,
        history: []
    });

    const fetchData = useCallback(async () => {
        if (!coinId) return;
        try {
            setComponentInfo(prev => ({...prev, status: DataStatus.Loading, callback: fetchData}));
            const [coinRes, historyRes] = await Promise.all([
                CryptoAPI.fetchCryptoDetail(coinId),
                CryptoAPI.fetchCryptoMarketChart(coinId, {
                    params: {
                        vs_currency: 'usd',
                        days,
                        interval: 'daily'
                    }
                })
            ]);

            const processedHistory = historyRes.data.prices.map(([ts, price]: [number, number]) => ({
                date: new Date(ts).toLocaleDateString(),
                price: parseFloat(price.toFixed(2))
            }));

            setState({
                crypto: coinRes.data,
                history: processedHistory
            });
            setComponentInfo(prev => ({...prev, status: DataStatus.Loaded }));
        } catch (err) {
            console.error(err);
            setComponentInfo(prev => ({...prev, status: DataStatus.ErrorState }));
        }
    }, [coinId, days, setComponentInfo]);

    useEffect(() => {
        fetchData().then(() => console.log('Data fetched'));
    }, [coinId, days]);

    return state;
};

const CryptoDetailPage = () => {

    const [days, setDays] = useState('7');
    const {cryptoId: coinId} = useParams<{ cryptoId: string }>();
    const [componentInfo, setComponentInfo] = useState<ComponentInfo>({status: DataStatus.Loaded});
    const {crypto, history} = useCryptoData(coinId, days, setComponentInfo);

    const handleDaysChange = useCallback((_: any, newDays: string) => {
        if (newDays !== null) setDays(newDays);
    }, []);

    const marketInfoItems = useMemo(() => {
        if (!crypto) return [];
        return [
            {
                label: 'Current Price',
                value: `$${crypto.market_data.current_price.usd.toLocaleString()}`,
                icon: <MonetizationOnIcon/>,
                color: 'primary.main',
            },
            {
                label: 'Market Cap',
                value: `$${crypto.market_data.market_cap.usd.toLocaleString()}`,
                icon: <AccountBalanceIcon/>,
                color: 'secondary.main',
            },
            {
                label: '24h High',
                value: `$${crypto.market_data.high_24h.usd.toLocaleString()}`,
                icon: <TrendingUpIcon/>,
                color: 'success.main',
            },
            {
                label: '24h Low',
                value: `$${crypto.market_data.low_24h.usd.toLocaleString()}`,
                icon: <TrendingDownIcon/>,
                color: 'error.main',
            },
            {
                label: 'Circulating Supply',
                value: `${crypto.market_data.circulating_supply.toLocaleString()}`,
                icon: <CachedIcon/>,
                color: 'info.main',
            },
            {
                label: 'Total Supply',
                value: crypto.market_data.total_supply ? crypto.market_data.total_supply.toLocaleString() : 'N/A',
                icon: <FunctionsIcon/>,
                color: 'warning.main',
            },
            {
                label: 'Max Supply',
                value: crypto.market_data.max_supply ? crypto.market_data.max_supply.toLocaleString() : 'N/A',
                icon: <NumbersIcon/>,
                color: 'text.secondary',
            },
        ];
    }, [crypto]);

    const chartData = useMemo(() => history, [history]);

    const toggleOptions = useMemo(() => [
        {label: '7D', value: '7'},
        {label: '30D', value: '30'},
        {label: '90D', value: '90'},
        {label: '180D', value: '180'}
    ], []);

    if (!crypto) {
        return (
            <Box sx={{textAlign: 'center', mt: 5}}>
                <Status componentInfos={[componentInfo]}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Please wait..
                    </Typography>
                </Status>
                <>
                    {
                        componentInfo.status !== DataStatus.ErrorState
                        && <>
                            <span>Servers might be busy. </span>
                            <Box component="span"
                                 sx={{
                                     color: 'primary.main',
                                     cursor: 'pointer',
                                     textDecoration: 'underline',
                                     display: 'inline',
                                     fontWeight: 500
                                 }}
                                 onClick={componentInfo.callback}>
                                click here
                            </Box>
                            <span> if its already more than 2 mins.. </span>
                        </>
                    }
                </>
            </Box>
        );
    }

    const {
        image,
        name,
        symbol,
        hashing_algorithm,
        description,
        categories,
        links
    } = crypto;

    return (
        <StyledCard>
            <Status componentInfos={[componentInfo]} showRetry={true}>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 4}}>
                    <Box sx={{flex: {xs: '1 1 100%', md: '1 1 33.33%'}}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={image.large} alt={name} sx={{width: 80, height: 80}}/>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>{name} ({symbol.toUpperCase()})</Typography>
                                <InfoLabel>{hashing_algorithm || 'No hashing algorithm provided'}</InfoLabel>
                            </Box>
                        </Stack>

                        <Divider sx={{my: 3}}/>

                        <Stack spacing={2}>
                            {description && description.en && (
                                <Typography variant="body1" color="text.primary"
                                            dangerouslySetInnerHTML={{__html: description.en.split('. ')[0] + '.'}}
                                />
                            )}

                            <Box sx={{mb: 3}}>
                                <SectionTitle variant="h6">Market Info</SectionTitle>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                                    {marketInfoItems.map((item, index) => (
                                        <MarketInfoItem key={index}
                                                        label={item.label}
                                                        value={item.value}
                                                        icon={item.icon}
                                                        color={item.color} />
                                    ))}
                                </Box>
                            </Box>

                            <Box sx={{mb: 4}}>
                                <SectionTitle variant="h6">Categories</SectionTitle>
                                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                    {categories.map((cat: string, idx: number) => (
                                        <Chip key={idx}
                                              label={cat}
                                              variant="filled"
                                              color={'primary'}
                                              sx={{mb: 1}}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Box>
                                <SectionTitle variant="h6">Website</SectionTitle>
                                <Typography component="a" href={links.homepage[0]} target="_blank" rel="noopener"
                                            color="primary">
                                    {links.homepage[0]}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{flex: {xs: '1 1 100%', md: '1 1 66.66%'}}}>
                        <Box sx={{mb: 3}}>
                            <SectionTitle variant="h6" sx={{mb: 1}}>Price Chart</SectionTitle>
                            <ToggleButtonGroup value={days}
                                               exclusive
                                               onChange={handleDaysChange}
                                               aria-label="Chart Range"
                                               sx={{
                                                   flexWrap: 'wrap',
                                                   borderRadius: 2,
                                                   boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                                                   backgroundColor: '#f9f9f9',
                                                   p: 0.5,
                                                   mb: 2,
                                               }}
                                               size="small">
                                {toggleOptions.map(({label, value}) => (
                                    <ToggleButton key={value}
                                                  value={value}
                                                  sx={{
                                                      border: 0,
                                                      px: 2,
                                                      py: 1,
                                                      borderRadius: 2,
                                                      textTransform: 'none',
                                                      fontWeight: 500,
                                                      '&.Mui-selected': {
                                                          backgroundColor: 'primary.main',
                                                          color: 'white',
                                                          '&:hover': {
                                                              backgroundColor: 'primary.dark'
                                                          }
                                                      },
                                                      '&:hover': {
                                                          backgroundColor: '#e0e0e0'
                                                      }
                                                  }}>
                                        {label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>

                        <CryptoChart data={chartData}
                                     gradientId="colorPrice"
                                     stopColor="#1976d2"
                                     lineColor="#1976d2"/>
                    </Box>
                </Box>

                {/*<Divider sx={{my: 4}}/>*/}

                {/*<Box sx={{mt: 4}}>*/}
                {/*    <SectionTitle variant="h6">Historical Price Chart</SectionTitle>*/}
                {/*    <CryptoChart data={chartData}*/}
                {/*                 gradientId="colorHistorical"*/}
                {/*                 stopColor="#8884d8"*/}
                {/*                 lineColor="#8884d8"/>*/}
                {/*</Box>*/}
            </Status>
        </StyledCard>
    );
};

export default CryptoDetailPage;