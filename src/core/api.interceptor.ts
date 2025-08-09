import axios, {type AxiosError, type AxiosResponse} from 'axios';

const _axios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


_axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const { response } = error;
        if (response && response.status === 401) {
            localStorage.removeItem('LOGIN_KEY');
            window.location.href = '/auth/login';
        }
        console.error('API Error: ', error);
        return Promise.reject(error);
    }
);

export default _axios;