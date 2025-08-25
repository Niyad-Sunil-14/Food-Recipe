import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://food-recipe-backend-hntt.onrender.com/api/', // Your Django API base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor to add the JWT token to every request
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;