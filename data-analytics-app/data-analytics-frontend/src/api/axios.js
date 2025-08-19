// src/api/axios.js

import axios from 'axios';
import AuthService from '../services/auth.service';

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    // --- START: FORCEFULLY DISABLE CACHING ---
    // "Cache-Control": "no-cache, no-store, must-revalidate",
    // "Pragma": "no-cache",
    // "Expires": "0",
    // --- END: FORCEFULLY DISABLE CACHING ---
  },
});

instance.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      // Axios now standardizes on the Authorization header for Bearer tokens
      config.headers["Authorization"] = 'Bearer ' + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;