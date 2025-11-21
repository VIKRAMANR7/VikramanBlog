import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { assets } from "../assets/assets";

export default function Navbar() {
  const navigate = useNavigate();
  const { token } = useAppContext();

  return (
    <header className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Vikraman Blog logo"
        className="cursor-pointer"
      />

      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
      >
        {token ? "Dashboard" : "Login"}
        <img src={assets.arrow} alt="" className="w-3" />
      </button>
    </header>
  );
}
