import axios from 'axios';

// Create Axios instance
const http = axios.create({
    baseURL: 'http://35.193.10.17/api', // Use absolute URL for APK/Production
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor
http.interceptors.request.use(
    (config) => {
        // Add auth token if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
http.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Global error handling
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            if (error.response.status === 401) {
                // Handle unauthorized
            }
        }
        return Promise.reject(error);
    }
);

export default http;
