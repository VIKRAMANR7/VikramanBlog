import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL ?? "";

export const api = axios.create({
  baseURL,
});

// Set token on login
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
