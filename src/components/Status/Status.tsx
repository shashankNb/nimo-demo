import React, {useCallback, useMemo} from 'react';
import {Box, IconButton, styled, Typography} from '@mui/material';
import RefreshIcon from "@mui/icons-material/Refresh";
import {Image} from "@mui/icons-material";

const CenteredContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    textAlign: 'center',
});

const LoadingIndicator = () => (
    <CenteredContainer>
        <img alt={'loader'} src={'/loaders/loader.svg'} width={48} />
        {/*<CircularProgress size={60} sx={{mb: 2}}/>*/}
        {/*<Typography variant="body1">Loading...</Typography>*/}
    </CenteredContainer>
);

interface ErrorPanelProps {
    onRetry: () => void;
    showRetry: boolean;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({onRetry, showRetry}) => (
    <CenteredContainer>
        <Typography color="error" fontWeight="bold">
            {showRetry ? 'An error occurred.' : 'Error! Please contact customer service.'}
        </Typography>
        {showRetry && (
            <Box display="flex"
                 alignItems="center"
                 justifyContent="center"
                 sx={{cursor: 'pointer', color: 'error.main', mt: 2}}
                 onClick={onRetry}>
                <Typography variant="body2" fontWeight="bold">
                    Retry
                </Typography>
                <IconButton size="small" color="error">
                    <RefreshIcon/>
                </IconButton>
            </Box>
        )}
    </CenteredContainer>
);

export enum DataStatus {
    Loading = 'Loading',
    Loaded = 'Loaded',
    ErrorState = 'ErrorState'
}

export interface ComponentInfo {
    status: DataStatus;
    callback?: (args: any) => void;
    callbackArgs?: any;
}

export interface ContentInfoProps {
    children: React.ReactNode;
    componentInfos: ComponentInfo[];
    showRetry?: boolean;
    showContentOnLoading?: boolean;
    showContentOnError?: boolean;
}

const Status: React.FC<ContentInfoProps> = ({
                                                children,
                                                componentInfos = [],
                                                showRetry = false,
                                                showContentOnLoading = false,
                                                showContentOnError = false,
                                            }) => {

    const {isLoading, hasError, isLoaded} = useMemo(() => {
        const loading = componentInfos.some(info => info.status === DataStatus.Loading);
        const error = componentInfos.some(info => info.status === DataStatus.ErrorState);
        const loaded = componentInfos.every(info => info.status === DataStatus.Loaded);
        return {isLoading: loading, hasError: error, isLoaded: loaded};
    }, [componentInfos]);

    const reFetchAll = useCallback(() => {
        componentInfos.forEach(item => {
            if (item.callback) {
                item.callback(item.callbackArgs);
            }
        });
    }, [componentInfos]);

    if (isLoading && !showContentOnLoading) {
        return <LoadingIndicator/>;
    }

    if (hasError && !showContentOnError) {
        return <ErrorPanel onRetry={reFetchAll} showRetry={showRetry}/>;
    }

    if (isLoaded || (isLoading && showContentOnLoading) || (hasError && showContentOnError)) {
        return <Box>{children}</Box>;
    }

    return null;
};

export default Status;