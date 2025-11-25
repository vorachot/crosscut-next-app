import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL,
  withCredentials: true,
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint - cookies will be automatically included
        await axios.get(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/auth/refresh-token`, // Empty body since refresh token is in httpOnly cookie
          { withCredentials: true },
        );

        // Retry the original request - new access token cookie will be automatically included
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login on refresh failure
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
