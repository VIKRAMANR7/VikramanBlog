import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/admin/Sidebar";

export default function Layout() {
  const { saveToken } = useAppContext();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    saveToken("");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200 bg-white shadow-sm relative z-50">
        <img
          src={assets.logo}
          alt="Vikraman Blog Admin Logo"
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition"
          aria-label="Logout"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 h-[calc(100vh-70px)] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-blue-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
