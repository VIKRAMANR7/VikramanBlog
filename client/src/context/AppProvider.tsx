import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { api, setAuthToken } from "../api/axiosInstance";
import type { Blog } from "../types/blog";
import { AppContext } from "./AppContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [input, setInput] = useState("");

  const saveToken = useCallback((value: string | null) => {
    if (!value) {
      localStorage.removeItem("token");
      setToken(null);
      setAuthToken(null);
      return;
    }

    localStorage.setItem("token", value);
    setToken(value);
    setAuthToken(value);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthToken(null);
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await api.get<{ success: boolean; blogs: Blog[] }>("/api/blog");

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error("Failed to load blogs");
      }
    } catch {
      toast.error("Failed to load blogs");
    }
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [handleLogout]);

  const value = {
    token,
    saveToken,
    handleLogout,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
