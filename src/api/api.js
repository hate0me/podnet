import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8181',
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            try {
                const { data } = await api.post('/auth/refresh-token', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });

                localStorage.setItem('accessToken', data.accessToken);
                return api(originalRequest);
            } catch (e) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;