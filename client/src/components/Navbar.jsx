import { useAppContext } from "../../context/AppContext";
import { assets } from "../assets/assets";

export default function Navbar() {
  const { navigate, token } = useAppContext();
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="cursor-pointer"
      />
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
      >
        {token ? "Dashboard" : "Login"}
        <img src={assets.arrow} alt="" className="w-3" />
      </button>
    </div>
  );
}
