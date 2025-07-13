import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

const instance = axios.create({ baseURL })

const token = localStorage.getItem('token')
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default instance