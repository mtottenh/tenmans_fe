// src/refreshAxios.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const refreshAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});



refreshAxios.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.refreshToken) {
      config.headers.Authorization = `Bearer ${authStore.refreshToken}`;
    }
    return config;
  });

export default refreshAxios;