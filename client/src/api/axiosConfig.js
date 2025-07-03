import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(
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

export default axios;