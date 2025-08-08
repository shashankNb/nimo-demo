import React, {useState} from 'react';
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import {useAuthContext} from "@/core/context.ts"; // Assuming this context exists

const MainContent = styled(Box)(({theme}) => ({
    width: '100%',
    maxWidth: 1300,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const MainHeader = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const {userHasAuthenticated} = useAuthContext();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleLogout = () => {
        handleCloseUserMenu();
        localStorage.removeItem("LOGIN_KEY");
        userHasAuthenticated(false);
    }

    const userMenuItems = [
        {label: 'Logout', onClick: handleLogout},
    ];

    return (
        <AppBar position="fixed">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6" noWrap component="div">
                    Nimo
                </Typography>
                <Box>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar alt="User Avatar"
                                    src="https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu sx={{mt: '45px'}}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                          keepMounted
                          transformOrigin={{vertical: 'top', horizontal: 'right'}}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}>
                        {userMenuItems.map((item) => (
                            <MenuItem key={item.label} onClick={item.onClick}>
                                <Typography textAlign="center">{item.label}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

const MainLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <CssBaseline/>
            <MainHeader/>
            <Toolbar/>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <MainContent>
                    {children}
                </MainContent>
            </Box>
        </>
    );
};

export default MainLayout;