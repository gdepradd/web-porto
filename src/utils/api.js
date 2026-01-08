import axios from 'axios';

const api = axios.create({
    // KITA HARDCODE KOSONG.
    // Jangan pakai if-else, jangan pakai import.meta.env
    // Biarkan browser yang menempelkan domain sendiri.
    baseURL: '',

    withCredentials: true
});

export default api;