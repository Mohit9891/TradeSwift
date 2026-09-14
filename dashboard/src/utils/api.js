import axios from "axios";

const env = import.meta.env || {};
const BASE_URL =
  env.VITE_BACKEND_URL ||
  env.REACT_APP_BACKEND_URL ||
  "http://localhost:3002";
const FRONTEND_URL =
  env.VITE_FRONTEND_URL ||
  env.REACT_APP_FRONTEND_URL ||
  "http://localhost:5173";

export function getToken() {
  return localStorage.getItem("kite_token") || "";
}

// Migrate legacy ?user=<encoded {mobile,token}> links into localStorage once.
export function migrateTokenFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("user");
    if (!raw) return false;
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed?.token) {
      localStorage.setItem("kite_token", parsed.token);
      if (parsed.mobile) localStorage.setItem("kite_mobile", parsed.mobile);
      // strip query so token never lingers in history / referrers
      params.delete("user");
      const clean =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", clean);
      return true;
    }
  } catch {
    // ignore malformed query
  }
  return false;
}

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { BASE_URL, FRONTEND_URL };
export default api;
