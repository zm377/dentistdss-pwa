import api from './config';

// Helpers to manage auth tokens in localStorage. The request interceptor in
// api/config.js automatically injects these tokens on every request, so all we
// need to do is persist / clear them here.
const storeToken = (accessToken, tokenType = 'Bearer') => {
  if (!accessToken) return;
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('tokenType', tokenType);
};

const clearToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenType');
};

const authAPI = {
  /**
   * Login with email & password — stores token automatically.
   * Returns the object coming from backend (typically { accessToken, tokenType, user })
   */
  async login(email, password) {
    const authData = await api.post('/api/auth/login', { email, password });

    // The interceptor unwraps successful responses to `response.message`,
    // so `authData` should already be that object.
    storeToken(authData.accessToken, authData.tokenType);

    return authData; // caller can extract user etc.
  },

  /**
   * Sign-up helper.  Accepts a userData object and returns the unwrapped
   * response from the backend (handled by interceptor).
   */
  async signup(userData) {
    return api.post('/api/auth/signup', userData);
  },

  /**
   * Verifies an existing session/token and returns the user profile if valid.
   */
  async me() {
    return api.get('/api/auth/me');
  },

  /**
   * Backend logout + local cleanup. Always clears local tokens, even if the
   * network request fails (e.g. expired token).
   */
  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (_) {
      // ignore — server might reject due to already invalidated token
    } finally {
      clearToken();
    }
  },

  // ----- Verification helpers (unchanged) -----
  verifySignupToken: (vtoken) => api.get(`/api/auth/signup/verify?vtoken=${vtoken}`),
  verifySignupWithCode: (email, code) => api.post('/api/auth/signup/verify/code', { email, code }),
  resendVerificationCode: (email) => api.post(`/api/auth/signup/verify/code/resend?email=${email}`),
};

export default authAPI;
