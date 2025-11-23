import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('sessionId') ?? `sess_${crypto.randomUUID()}`;
  localStorage.setItem('sessionId', sessionId);
  config.headers.set('X-Session-Id', sessionId);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? '网络异常';
    return Promise.reject(new Error(message));
  },
);

export default api;
