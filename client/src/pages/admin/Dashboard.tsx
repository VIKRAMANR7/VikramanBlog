import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Blog } from "../../../context/AppContext";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";

interface DashboardData {
  blogs: number;
  comments: number;
  drafts: number;
  recentBlogs: Blog[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/dashboard");

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="flex flex-wrap gap-4">
        <StatCard icon={assets.dashboard_icon_1} value={dashboardData.blogs} label="Blogs" />

        <StatCard icon={assets.dashboard_icon_2} value={dashboardData.comments} label="Comments" />

        <StatCard icon={assets.dashboard_icon_3} value={dashboardData.drafts} label="Drafts" />
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3 m-4 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="" />
          <p className="text-lg font-medium">Latest Blogs</p>
        </div>

        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg bg-white">
          {dashboardData.recentBlogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent blogs available.</div>
          ) : (
            <table className="w-full text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-2 py-3 xl:px-6">#</th>
                  <th className="px-2 py-3">Blog Title</th>
                  <th className="px-2 py-3 max-sm:hidden">Date</th>
                  <th className="px-2 py-3 max-sm:hidden">Status</th>
                  <th className="px-2 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    index={index + 1}
                    fetchBlogs={fetchDashboard}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow hover:scale-105 transition-all cursor-pointer">
      <img src={icon} alt="" className="w-10 h-10" />
      <div>
        <p className="text-xl font-semibold text-gray-700">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </div>
  );
}
