import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Tooltip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useHistoryContext, useLoaderContext} from "@/core/context.ts";

const BackButton = () => {
    const {history, goBack, getCurrentPage} = useHistoryContext();
    const navigate = useNavigate();
    const {setPreLoader} = useLoaderContext();

    const handleBack = useCallback(async () => {
        if (history.length > 1) {
            goBack();
            const previousPage = history[history.length - 2];
            setPreLoader(true);
            navigate(previousPage);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPreLoader(false);
        } else {
            navigate('/');
        }
    }, [history, goBack, navigate, setPreLoader]);

    const canGoBack = history.length > 1;

    return (
        canGoBack && getCurrentPage() !== '/' && (
            <Tooltip title="Go back to the previous page" arrow>
                <span>
                    <Button startIcon={<ArrowBackIcon/>}
                            color="primary"
                            variant="outlined"
                            onClick={handleBack}>
                        Go Back
                    </Button>
                </span>
            </Tooltip>
        )
    );
};

export default BackButton;
