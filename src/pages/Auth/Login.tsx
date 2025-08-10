import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    styled,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useAuthContext, useLoaderContext, useStateContext} from "@/core/context.ts";


const RootContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const SideBanner = styled(Box)(({theme}) => ({
    width: '70%',
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',

    minWidth: 0,
    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '40%',
        padding: theme.spacing(4),
    },
}));

const LoginPanel = styled(Paper)(({theme}) => ({
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(6),
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '60%',
        // padding: theme.spacing(4),
    },
}));

const Login = () => {
    const {userHasAuthenticated} = useAuthContext();
    const {setPreLoader} = useLoaderContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {setState} = useStateContext();

    const formik = useFormik({
        initialValues: {
            email: 'user@demo.com',
            password: 'demo'
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            setPreLoader(true);
            setError('');

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (values.email === import.meta.env.VITE_USER_NAME && values.password === import.meta.env.VITE_USER_PASSWORD) {
                    localStorage.setItem('LOGIN_KEY', values.email);
                    setState(prevState => ({
                        ...prevState,
                        auth: {email: 'user@demo.com', name: 'Demo User'}
                    }))
                    userHasAuthenticated(true);
                } else {
                    setError('Invalid credentials. Please try again.');
                }
            } catch (err: any) {
                console.log(err);
                setError('An error occurred during login. Please try again.');
            } finally {
                setLoading(false);
                setPreLoader(false);
            }
        }
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <RootContainer>
            {!isMobile && (
                <SideBanner>
                    <Box>
                        <img
                            src="/background.png"
                            alt="illustration"
                            style={{maxWidth: '100%', height: 'auto'}}
                        />
                    </Box>
                </SideBanner>
            )}

            <LoginPanel square elevation={0}>
                <Box sx={{width: '100%', maxWidth: 400}}>
                    <Box textAlign="center">
                        <Typography variant="h6" sx={{mt: 2, mb: 3}}>
                            Hi! Login to your dashboard
                        </Typography>
                    </Box>

                    <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                        <TextField fullWidth
                                   id="email"
                                   name="email"
                                   label="Email"
                                   margin="normal"
                                   value={formik.values.email}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.email && Boolean(formik.errors.email)}
                                   helperText={formik.touched.email && formik.errors.email}
                                   disabled={loading}
                        />
                        <TextField fullWidth
                                   id="password"
                                   name="password"
                                   label="Password"
                                   type="password"
                                   margin="normal"
                                   value={formik.values.password}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.password && Boolean(formik.errors.password)}
                                   helperText={formik.touched.password && formik.errors.password}
                                   disabled={loading}
                        />
                        <Button type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{mt: 2, py: 1.3, fontWeight: 600}}
                                disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <Typography variant="caption" display="block" textAlign="center" mt={5}>
                            Copyright @ 2025 by Shashank
                        </Typography>
                    </Box>
                </Box>
            </LoginPanel>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert onClose={() => setError('')} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
        </RootContainer>
    );
};

export default Login;