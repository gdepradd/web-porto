import axios from 'axios';

const api = axios.create({
    // Kalau mode Production (Vercel), pakai '' (relative path).
    // Kalau mode Development (Laptop), pakai 'http://localhost:5000'
    baseURL: import.meta.env.PROD ? '' : 'http://localhost:5000',
    withCredentials: true
});

export default api;