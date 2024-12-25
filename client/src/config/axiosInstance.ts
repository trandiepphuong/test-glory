import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import QueryString from "qs";
import { toast } from "sonner";
import { BaseURL } from "./configuration";
import { refreshToken } from "@/services/auth.service"; // Import the refreshToken function

export const axiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 1000,
  paramsSerializer: (params) => {
    return QueryString.stringify(params, {
      skipNulls: true,
      arrayFormat: "brackets",
      filter: (_, value) => value || undefined,
    });
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (configure: InternalAxiosRequestConfig) => {
    const newConfigure: InternalAxiosRequestConfig = { ...configure };

    const token = localStorage.getItem('token') || "";

    if (token) {
      newConfigure.headers.Authorization = `Bearer ${token}`;
    }

    return newConfigure;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor to handle 401 errors (token expired)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;
    const modifyMethods = ["post", "put", "patch", "delete"];

    if (
      config.method &&
      modifyMethods.includes(config.method) &&
      data.message
    ) {
      toast("Success!", {
        description: data.message,
      });
    }

    return data; // Return only the response data
  },
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Check if we've already tried to refresh token
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Attempt to refresh the token
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
          try {
            const result = await refreshToken(refreshTokenValue);

            localStorage.setItem("token", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;
            return axios(originalRequest);
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            toast("Session expired, please log in again.", {
              description: "Your session has expired. Please log in again.",
            });
            window.location.href = "/sign-in";
            return Promise.reject(err);
          }
        }
      }
    }

    // Show failure toast if the error is not a 401
    toast("Failure!", {
      description: error.response?.data.message ?? error.message ?? "Something went wrong!",
    });
    return Promise.reject(error);
  }
);

