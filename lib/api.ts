import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { logger } from "@/lib/logger";

// Prefer app.json extra over env to avoid mismatch between Metro and native envs
const configured = ((Constants.expoConfig?.extra as any)?.API_URL ||
  process.env.EXPO_PUBLIC_API_URL) as string | undefined;
const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const baseURL = configured || `http://${defaultHost}:3000`;
logger.info("API baseURL", { baseURL });

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

const raw = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let queue: { resolve: () => void; reject: (err?: Error) => void }[] = [];

const flushQueue = (error: Error | null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: any) => {
    logger.warn("API error", {
      url: error?.config?.url,
      status: error?.response?.status,
    });
    const original = error.config as AxiosRequestConfigWithRetry;
    const status = error?.response?.status;
    const shouldRefresh =
      (status === 401 || status === 403) && !original._retry;
    if (!shouldRefresh) return Promise.reject(error);

    original._retry = true;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve: () => resolve(api(original)), reject });
      });
    }

    isRefreshing = true;
    try {
      logger.info("Refreshing auth token");
      await raw.get("/api/auth/refresh");
      flushQueue(null);
      return api(original);
    } catch (err) {
      const status = (err as any)?.response?.status;
      if (status === 401) {
        logger.debug("Token refresh failed (401)");
      } else {
        logger.error("Token refresh failed", err);
      }
      flushQueue(err as Error);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

api.interceptors.request.use((config) => {
  (config as any).metadata = { start: Date.now() };
  logger.debug(`Request ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    const meta = (response.config as any).metadata;
    if (meta?.start) {
      const ms = Date.now() - meta.start;
      logger.debug(
        `Response ${response.status} ${response.config.url} in ${ms}ms`
      );
    }
    return response;
  },
  (error) => {
    const meta = (error.config as any)?.metadata;
    if (meta?.start) {
      const ms = Date.now() - meta.start;
      logger.debug(`Response ERROR ${error.config?.url} in ${ms}ms`);
    }
    return Promise.reject(error);
  }
);

export default api;
export { raw };
