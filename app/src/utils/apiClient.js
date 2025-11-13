// utils/apiClient.js
import { TokenManager } from './tokenUtils';

class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.failedRequests = [];
  }

  // --------------------------
  // Main request handler
  // --------------------------
  async request(url, options = {}) {
    const { token } = TokenManager.getTokens();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);

      if (response.status === 401) {
        // Access token expired → try refresh
        return this.handleUnauthorized(url, config);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // --------------------------
  // Handle 401 (token expired)
  // --------------------------
  async handleUnauthorized(originalUrl, originalConfig) {
    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedRequests.push({ resolve, reject });
      }).then(async () => {
        const { token: newToken } = TokenManager.getTokens();
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${this.baseURL}${originalUrl}`, originalConfig);
        if (!retryResponse.ok) throw new Error(`Retry failed: ${retryResponse.status}`);
        return retryResponse.json();
      });
    }

    // Start token refresh
    this.isRefreshing = true;
    this.refreshPromise = this.refreshToken();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;

      // Retry original request
      originalConfig.headers.Authorization = `Bearer ${newToken}`;
      const retryResponse = await fetch(`${this.baseURL}${originalUrl}`, originalConfig);
      if (!retryResponse.ok) throw new Error(`Retry failed: ${retryResponse.status}`);

      // Resolve all waiting requests
      this.failedRequests.forEach(({ resolve }) => resolve());
      this.failedRequests = [];

      return retryResponse.json();
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.failedRequests.forEach(({ reject }) => reject(error));
      this.failedRequests = [];

      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // --------------------------
  // Refresh token logic
  // --------------------------
  async refreshToken() {
    const { refreshToken, rememberMe } = TokenManager.getTokens();

    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Token refresh failed');

    const data = await response.json();
    // ✅ Adjust according to your backend response keys
    const { token: newToken, refreshToken: newRefreshToken } = data.data;

    TokenManager.setTokens(newToken, newRefreshToken, rememberMe);
    return newToken;
  }

  // --------------------------
  // Shortcut methods
  // --------------------------
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
