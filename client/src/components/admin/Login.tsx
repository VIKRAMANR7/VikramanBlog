import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

export default function Login() {
  const { saveToken } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/admin/login", { email, password });
      if (data.success) {
        saveToken(data.token);
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50/20">
      <div className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          <span className="text-primary">Admin</span> Login
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter credentials to access the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="Enter your email"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white font-medium rounded hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
