import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { Blog } from "../../types/blog";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";

interface DashboardData {
  blogs: number;
  comments: number;
  drafts: number;
  recentBlogs: Blog[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/dashboard");

      if (res.data.success) {
        setData(res.data.dashboardData);
      } else {
        toast.error(res.data.message || "Failed to load dashboard");
      }
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {/* Stats – fresher style without abstraction */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow">
          <img src={assets.dashboard_icon_1} alt="" className="w-10 h-10" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{data.blogs}</p>
            <p className="text-gray-400 text-sm">Blogs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow">
          <img src={assets.dashboard_icon_2} alt="" className="w-10 h-10" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{data.comments}</p>
            <p className="text-gray-400 text-sm">Comments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow">
          <img src={assets.dashboard_icon_3} alt="" className="w-10 h-10" />
          <div>
            <p className="text-xl font-semibold text-gray-700">{data.drafts}</p>
            <p className="text-gray-400 text-sm">Drafts</p>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="mt-10">
        <div className="flex items-center gap-3 m-4 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="" />
          <p className="text-lg font-medium">Latest Blogs</p>
        </div>

        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg bg-white">
          {data.recentBlogs.length === 0 ? (
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
                {data.recentBlogs.map((blog, index) => (
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
