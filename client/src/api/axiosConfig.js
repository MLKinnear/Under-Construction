import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    throw new Error ('VITE_API_URL is not defined!');
}

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const msg = error.response?.data?.error;

        if (status === 401) {
            alert(msg || 'Session timed out. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;