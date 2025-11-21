import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, setAuthToken } from "../api/axiosInstance";
import { Blog } from "../types/blog";
import { AppContext } from "./AppContext";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [input, setInput] = useState("");

  const saveToken = useCallback((value: string | null) => {
    try {
      if (!value) {
        localStorage.removeItem("token");
        setToken(null);
        setAuthToken(null);
        return;
      }

      localStorage.setItem("token", value);
      setToken(value);
      setAuthToken(value);
    } catch {
      toast.error("Unable to persist session.");
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
    setToken(null);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await api.get<{ success: boolean; blogs: Blog[] }>("/api/blog");

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error("Failed to load blogs.");
      }
    } catch {
      toast.error("Failed to load blogs.");
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const message: string = error?.response?.data?.message?.toLowerCase() ?? "";

        if (error.response?.status === 401) {
          if (message.includes("expired")) {
            toast.error("Session expired. Please log in again.");
          } else {
            toast.error("Invalid session. Please log in again.");
          }
          handleLogout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [handleLogout]);

  const value = useMemo(
    () => ({
      token,
      saveToken,
      handleLogout,
      blogs,
      setBlogs,
      input,
      setInput,
      fetchBlogs,
    }),
    [token, saveToken, handleLogout, blogs, input, fetchBlogs]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
