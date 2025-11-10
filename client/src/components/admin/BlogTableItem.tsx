import axios from "axios";
import { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Blog } from "../../../context/AppContext";
import { assets } from "../../assets/assets";

interface BlogTableItemProps {
  blog: Blog;
  fetchBlogs: () => Promise<void>;
  index: number;
}

export default function BlogTableItem({ blog, fetchBlogs, index }: BlogTableItemProps) {
  const navigate = useNavigate();
  const { title, createdAt, isPublished, _id } = blog;
  const [working, setWorking] = useState(false);
  const formattedDate = new Date(createdAt!).toLocaleDateString();

  const deleteBlog = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setWorking(true);
      const { data } = await axios.delete(`/api/blog/${_id}`);
      if (data.success) {
        toast.success(data.message || "Blog deleted");
        await fetchBlogs();
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to delete blog");
      }
    } finally {
      setWorking(false);
    }
  };

  const togglePublish = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      setWorking(true);
      const { data } = await axios.patch(`/api/blog/${_id}/publish`);
      if (data.success) {
        toast.success(data.message || "Status updated");
        await fetchBlogs();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to update status");
      }
    } finally {
      setWorking(false);
    }
  };

  const viewBlog = () => {
    navigate(`/blog/${_id}`);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={viewBlog}>
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4 font-medium text-blue-600 hover:underline">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{formattedDate}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <span className={`font-medium ${isPublished ? "text-green-600" : "text-orange-600"}`}>
          {isPublished ? "Published" : "Unpublished"}
        </span>
      </td>
      <td className="px-2 py-4 flex items-center gap-3 text-xs">
        <button
          onClick={togglePublish}
          disabled={working}
          className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition disabled:opacity-60"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={deleteBlog}
          disabled={working}
          className="p-1 hover:bg-red-50 rounded transition disabled:opacity-60"
          aria-label="Delete blog"
        >
          <img src={assets.cross_icon} className="w-5" alt="Delete blog icon" />
        </button>
      </td>
    </tr>
  );
}
