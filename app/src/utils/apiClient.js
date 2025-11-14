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
        this.failedRequests.push({ resolve, reject, url: originalUrl, config: originalConfig });
      }).then(async () => {
        // Wait for refresh to complete and retry with new token
        const { token: newToken } = TokenManager.getTokens();
        if (!newToken) {
          throw new Error('Token refresh completed but no new token available');
        }
        
        // Create a fresh config copy to avoid body consumption issues
        const retryConfig = {
          ...originalConfig,
          headers: {
            ...originalConfig.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };
        
        const retryResponse = await fetch(`${this.baseURL}${originalUrl}`, retryConfig);
        if (!retryResponse.ok) {
          throw new Error(`Retry failed: ${retryResponse.status}`);
        }
        return retryResponse.json();
      });
    }

    // Start token refresh
    this.isRefreshing = true;
    this.refreshPromise = this.refreshToken();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;

      if (!newToken) {
        throw new Error('Token refresh completed but no new token available');
      }

      // Create a fresh config copy to avoid body consumption issues
      const retryConfig = {
        ...originalConfig,
        headers: {
          ...originalConfig.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };

      // Retry original request
      const retryResponse = await fetch(`${this.baseURL}${originalUrl}`, retryConfig);
      if (!retryResponse.ok) {
        throw new Error(`Retry failed: ${retryResponse.status}`);
      }

      const retryResult = await retryResponse.json();

      // Only resolve all waiting requests AFTER successful retry
      this.failedRequests.forEach(({ resolve }) => resolve());
      this.failedRequests = [];

      return retryResult;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Reject all waiting requests
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

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Handle different response structures (data.data, data, or direct properties)
      let newToken, newRefreshToken;
      if (data.data) {
        newToken = data.data.token || data.data.accessToken;
        newRefreshToken = data.data.refreshToken;
      } else if (data.token || data.accessToken) {
        newToken = data.token || data.accessToken;
        newRefreshToken = data.refreshToken;
      } else {
        throw new Error('Invalid token refresh response structure');
      }

      if (!newToken || !newRefreshToken) {
        throw new Error('Token refresh response missing required tokens');
      }

      TokenManager.setTokens(newToken, newRefreshToken, rememberMe);
      return newToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
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
