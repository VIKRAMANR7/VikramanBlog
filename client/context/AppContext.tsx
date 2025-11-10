import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  image: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AppContextType {
  token: string | null;
  saveToken: (value: string) => void;
  handleLogout: () => void;
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  input: string;
  setInput: (input: string) => void;
}

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [input, setInput] = useState("");

  const saveToken = (value: string) => {
    if (!value) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setToken(null);
      return;
    }

    setToken(value);
    localStorage.setItem("token", value);
    axios.defaults.headers.common["Authorization"] = value;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = storedToken;
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || "";

        if (error.response?.status === 401 && message.includes("expired")) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        }

        if (error.response?.status === 401 && message.includes("Invalid or malformed token")) {
          toast.error("Invalid session. Please log in again.");
          handleLogout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; blogs: Blog[] }>("/api/blog");

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error("Failed to load blogs");
      }
    } catch {
      toast.error("Failed to load blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        token,
        saveToken,
        handleLogout,
        blogs,
        setBlogs,
        input,
        setInput,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
