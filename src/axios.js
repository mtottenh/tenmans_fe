import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/'
});


// Variables to manage refresh logic
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh and retry requests once the token is refreshed
function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}


instance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
    response => response,
    async error => {
      const authStore = useAuthStore();
      const originalRequest = error.config;
  
      // Check if error is due to expired access token and the request has not been retried yet
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        // If the refresh process is already in progress, add the request to subscribers
        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(instance(originalRequest));
            });
          });
        }
  
        // Set the refresh flag and attempt to refresh the token
        isRefreshing = true;
  
        try {
          await authStore.refreshAccessToken();
          isRefreshing = false;
  
          const newToken = authStore.accessToken;
  
          // Retry all requests in the queue with the new token
          onRefreshed(newToken);
  
          // Update the original request with the new token and retry it
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Clear refresh subscribers, reset flags, and log out on failure
          isRefreshing = false;
          refreshSubscribers = [];
          authStore.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

export default instance;