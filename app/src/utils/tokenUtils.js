// utils/tokenUtils.js

export const TokenManager = {
  // Save tokens
  setTokens: (token, refreshToken, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('rememberMe', 'false');
    }
  },

  // Get tokens
  getTokens: () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const token = rememberMe
      ? localStorage.getItem('authToken')
      : sessionStorage.getItem('authToken');

    const refreshToken = rememberMe
      ? localStorage.getItem('refreshToken')
      : sessionStorage.getItem('refreshToken');

    return { token, refreshToken, rememberMe };
  },

  // Clear tokens
  clearTokens: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem("userEmail")
  },

  // Check if tokens exist
  hasTokens: () => {
    const { token, refreshToken } = TokenManager.getTokens();
    return !!(token && refreshToken);
  },
};
