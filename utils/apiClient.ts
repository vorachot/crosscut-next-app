import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies } from "next/headers";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export async function apiClientServer(originalRequest?: AxiosRequestConfigWithRetry) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL,
    headers: accessToken
      ? {
        Authorization: `Bearer ${accessToken}`,
      }
      : undefined,
  });

  // Response interceptor to handle refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      if (error.response?.status === 401 && !originalRequest?._retry) {
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/auth/refresh-token`,
          { withCredentials: true } // refresh token cookie is httpOnly
        );

        const newAccessToken = refreshResponse.data.access_token;

        if (newAccessToken && originalRequest) {
          originalRequest._retry = true;
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return client(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}
