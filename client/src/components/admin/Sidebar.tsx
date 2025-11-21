import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

export default function Sidebar() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: assets.home_icon, end: true },
    { to: "/admin/addBlog", label: "Add Blog", icon: assets.add_icon },
    { to: "/admin/listBlog", label: "Blog List", icon: assets.list_icon },
    { to: "/admin/comments", label: "Comments", icon: assets.comment_icon },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {links.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 transition cursor-pointer ${
              isActive ? "bg-primary/10 border-r-4 border-primary" : "hover:bg-gray-100"
            }`
          }
        >
          <img src={icon} alt="" className="min-w-4 w-5" />
          <p className="hidden md:inline-block text-gray-700">{label}</p>
        </NavLink>
      ))}
    </aside>
  );
}
