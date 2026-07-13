import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend'imizin ana adresi
});

// Giden her isteği havada yakalayıp içine Token'ı ekliyoruz
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;