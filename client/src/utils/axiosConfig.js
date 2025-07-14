import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    throw new Error('VITE_API_URL is not defined!');
}

const instance = axios.create({ baseURL })

const token = localStorage.getItem('token')
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default instance