import axios from "axios";
import Cookies from "js-cookie";

// Example usage of Cookies to avoid the 'never read' error
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const {data} = await axios.post
//         }
