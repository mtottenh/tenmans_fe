// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from '@/axios';
import refreshAxios from '@/refreshAxios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    getUser: (state) => state.user,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/players/login', { email, password });
        const { message, access_token, refresh_token, player } = response.data;
        console.log(message)
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.user = player;

        localStorage.setItem('access_token', this.accessToken);
        localStorage.setItem('refresh_token', this.refreshToken);
      } catch (error) {
        throw new Error('Invalid email or password');
      }
    },
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    async refreshAccessToken() {
        try {
          const response = await refreshAxios.post('/players/refresh');
          const { access_token } = response.data;
          console.log(response.data)
          this.accessToken = access_token;
          localStorage.setItem('access_token', access_token);
        } catch (error) {
          this.logout(); // Logout if refresh fails
          throw new Error('Session expired. Please log in again.' + error);
        }
      },
  },
});