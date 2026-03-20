import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // We need to change that in the futur because we want to use the cookie for authentication, but for now we will use the token in the local storage
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
