import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  email: string;
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    responseType: 'json'
});

const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode(token) as DecodedToken;
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const cleanupAuth = () => {
    Cookies.remove('accessToken');
    window.location.href = '/pages/logini';
};

api.interceptors.request.use(config => {
    const token = Cookies.get("accessToken");
    
    if (token) {
        if (isTokenExpired(token)) {
            cleanupAuth();
            return Promise.reject('Token expired');
        }
        
        config.headers.Authorization = `Bearer ${token}`;
        
        if (config.url?.includes('/api/files/retrieve/')) {
            config.responseType = 'blob';
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error?.response?.status === 401) {
            cleanupAuth();
        }
        return Promise.reject(error);
    }
);