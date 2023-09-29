import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AxiosResponse } from "axios";
import globalConfig from "src/config";
import {
  getStorageJwtToken,
  getStorageRefreshToken,
  removeStorageJwtToken,
  removeStorageRefreshToken,
  setStorageJwtToken,
  setStorageRefreshToken,
} from "src/helpers/storage";

export const handleRefreshToken = async (): Promise<string | null> => {
  const refresh = getStorageRefreshToken();
  if (refresh) {
    try {
      const body: { refresh_token: string } = { refresh_token: refresh };
      const res = await axios.post<{
        access_token: string;
        refresh_token: string;
      }>(globalConfig.apiBaseUrl + "auth/refresh-token/admin", body);
      setStorageJwtToken(res.data.access_token);
      setStorageRefreshToken(res.data.refresh_token);

      return res.data.access_token;
    } catch (error) {
      removeStorageJwtToken();
      removeStorageRefreshToken();
      window.location.reload();
    }
  }
  return null;
};
export class HttpClient {
  axiosInstance: AxiosInstance;

  constructor() {
    const tokenAccess = getStorageJwtToken();
    let configs: AxiosRequestConfig = {
      baseURL: globalConfig.apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenAccess}`,
        "ngrok-skip-browser-warning": true,
        "api-key": "api-key-test",
      },
      timeout: 20000,
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData) {
            if (headers) {
              delete headers["Content-Type"];
            }
            return data;
          }
          return JSON.stringify(data);
        },
      ],
    };

    this.axiosInstance = axios.create(configs);

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const tokenAccess = getStorageJwtToken();
        if (config.headers) {
          if (tokenAccess)
            config.headers["Authorization"] = "Bearer " + tokenAccess;
          config.headers["allowRetry"] = true;
        }
        return config;
      },
      (error) => error
    );
    this.axiosInstance.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error: {
        config: AxiosRequestConfig;
        response: AxiosResponse;
      }) => {
        const config = error.config;
        const allowRetry = config.headers?.["allowRetry"];
        const isLoginPath = error.response.config.url === "auth/login/admin";
        if (error.response.status === 401 && allowRetry && !isLoginPath) {
          const token = await handleRefreshToken();
          if (token && config.headers) {
            config.headers["allowRetry"] = true;
            return this.axiosInstance(config);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
