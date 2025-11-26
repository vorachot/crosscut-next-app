// utils/apiClient.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { get } from "http";
import router from "next/router";

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL,
});

// Attach access token automatically
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getCookie("access_token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: retry on 401 using refresh token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        // Call refresh endpoint using refresh token in Authorization header
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/auth/refresh-token`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        if (newAccessToken) setCookie("access_token", newAccessToken, { httpOnly: true });
        if (newRefreshToken) setCookie("refresh_token", newRefreshToken, { httpOnly: true });

        // Retry original request with new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        router.push("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
