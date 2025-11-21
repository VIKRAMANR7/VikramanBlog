import { createContext } from "react";
import { Blog } from "../types/blog";

export interface AppContextType {
  token: string | null;
  saveToken: (value: string | null) => void;
  handleLogout: () => void;
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  input: string;
  setInput: (input: string) => void;
  fetchBlogs: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
