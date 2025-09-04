// src/api/api.js
import axios from 'axios';

// Lee la URL base de las variables de entorno de Vite.
// Si no existe, usa la URL local para desarrollo.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Crea una instancia de Axios con la URL base del backend
const api = axios.create({
    baseURL: baseURL 
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;