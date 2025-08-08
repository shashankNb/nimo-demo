import React from 'react';
import {Avatar, Box, Card, CardContent, Stack, styled, Typography} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface TrendingItem {
    title: string;
    value: number;
    percentage?: number;
    icon?: string;
}

interface TrendingCardProps {
    cardTitle: string;
    data: TrendingItem[];
    CardIcon: React.ReactNode;
    valueType?: 'DOLLAR' | 'NONE';
}

const StyledCard = styled(Card)(({theme}) => ({
    border: `2px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.spacing(2.5),
    boxShadow: 'none',
}));

const TrendItemContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const TrendingItemRow: React.FC<{ item: TrendingItem, valueType: 'DOLLAR' | 'NONE' }> = ({item, valueType}) => {
    const formattedValue = valueType === 'DOLLAR'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(item.value)
        : item.value.toLocaleString();

    const percentageDisplay = item.percentage !== undefined && (
        <Typography fontWeight={'700'}
                    variant="caption"
                    color={item.percentage >= 0 ? 'green' : 'error.main'}
                    display="flex"
                    alignItems="center"
                    ml={1}>
            {item.percentage >= 0 ? <ArrowDropUpIcon fontSize="small"/> : <ArrowDropDownIcon fontSize="small"/>}
            {Math.abs(item.percentage)}%
        </Typography>
    );

    return (
        <TrendItemContainer>
            <Box display="flex" alignItems="center">
                {item.icon && (
                    <Avatar alt={item.title}
                            src={item.icon}
                            sx={{width: 24, height: 24, mr: 1}}
                    />
                )}
                <Typography fontWeight={500}>{item.title}</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography fontWeight={'700'}>{formattedValue}</Typography>
                {percentageDisplay}
            </Box>
        </TrendItemContainer>
    );
};

const TrendingCard: React.FC<TrendingCardProps> = ({cardTitle, data, CardIcon, valueType = 'NONE'}) => {
    return (
        <StyledCard>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography fontWeight={600} fontSize={20} display="flex" alignItems="center">
                        {CardIcon}
                        {cardTitle}
                    </Typography>
                </Box>
                <Stack spacing={2}>
                    {data.map((item: TrendingItem, index: number) => (
                        <TrendingItemRow key={index} item={item} valueType={valueType}/>
                    ))}
                </Stack>
            </CardContent>
        </StyledCard>
    );
};

export default TrendingCard;