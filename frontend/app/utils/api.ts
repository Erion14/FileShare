import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const isAuthEndpoint = config.url?.includes('/api/auth/');
    const token = Cookies.get("accessToken");
    
    if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            Cookies.remove('accessToken');
            window.location.href = '/logini';
        }
        return Promise.reject(error);
    }
);