import axios from 'axios';

const api = axios.create({
    // KITA PAKSA KOSONG DULU BIAR JALAN DI VERCEL
    baseURL: '',

    // Script lama (komentari dulu):
    // baseURL: import.meta.env.PROD ? '' : 'http://localhost:5000',

    withCredentials: true
});

export default api;