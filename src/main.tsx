import {createRoot} from 'react-dom/client'
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#1976d2'},
        secondary: {main: '#9c27b0'},
    },
    typography: {
        fontFamily: 'Inter, Arial, sans-serif'
    }
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ThemeProvider>
)
