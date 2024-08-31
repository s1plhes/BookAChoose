// src/services/auth.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API;
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API}/api/refresh-token`, {}, {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    });

                    const { accessToken } = response.data;
                    localStorage.setItem('token', accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    return axios(originalRequest);
                } catch (err) {
                    console.error('Refresh token failed', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
