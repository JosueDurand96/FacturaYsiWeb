import axios from "axios";
import { API_URL } from "./constants";
import { useAuth } from "./auth";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) useAuth.getState().logout();
    const message = error?.response?.data?.error ?? error?.message ?? "Error de red";
    return Promise.reject(new Error(message));
  }
);

export async function unwrap<T>(promise: Promise<{ data: unknown }>): Promise<T> {
  const res = await promise;
  const body = res.data as { success: boolean; data?: T; error?: string };
  if (body && body.success) return body.data as T;
  throw new Error(body?.error ?? "Error desconocido");
}

export async function unwrapWithMeta<T>(
  promise: Promise<{ data: unknown }>
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const res = await promise;
  const body = res.data as {
    success: boolean;
    data?: T;
    error?: string;
    meta?: Record<string, unknown>;
  };
  if (body && body.success) return { data: body.data as T, meta: body.meta };
  throw new Error(body?.error ?? "Error desconocido");
}
