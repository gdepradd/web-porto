import axios from 'axios';

const api = axios.create({
    // Vite otomatis baca URL dari .env jika ada, kalau tidak ada pakai localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export default api;