import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Blog } from "../../../context/AppContext";
import BlogTableItem from "../../components/admin/BlogTableItem";

export default function ListBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/blogs");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message || "Failed to load blogs");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to load blogs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">Loading blogs…</div>
    );
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">All Blogs</h1>
      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto bg-white shadow rounded-lg scrollbar-hide">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No blogs found.</p>
        ) : (
          <table className="w-full text-sm text-gray-600">
            <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
              <tr>
                <th className="px-2 py-3 xl:px-6">#</th>
                <th className="px-2 py-3">Blog Title</th>
                <th className="px-2 py-3 max-sm:hidden">Date</th>
                <th className="px-2 py-3 max-sm:hidden">Status</th>
                <th className="px-2 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  index={index + 1}
                  fetchBlogs={fetchBlogs}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
