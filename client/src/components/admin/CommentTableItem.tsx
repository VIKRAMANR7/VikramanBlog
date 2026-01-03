import toast from "react-hot-toast";

import { api } from "../../api/axiosInstance";
import { assets } from "../../assets/assets";
import type { Comment } from "../../types/comment";

interface CommentTableItemProps {
  comment: Comment;
  fetchComments: () => Promise<void>;
}

export default function CommentTableItem({ comment, fetchComments }: CommentTableItemProps) {
  const { blog, createdAt, _id, isApproved, name, content } = comment;

  async function approveComment() {
    try {
      const { data } = await api.patch(`/api/admin/comment/${_id}/approve`);

      if (data.success) {
        toast.success(data.message || "Comment approved");
        await fetchComments();
      } else {
        toast.error(data.message || "Unable to approve comment");
      }
    } catch {
      toast.error("Failed to approve comment");
    }
  }

  async function deleteComment() {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/api/admin/comment/${_id}`);

      if (data.success) {
        toast.success(data.message || "Comment deleted");
        await fetchComments();
      } else {
        toast.error(data.message || "Unable to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    }
  }

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-700">Blog</b>: {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-700">Name</b>: {name}
        <br />
        <b className="font-medium text-gray-700">Comment</b>: {content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">{new Date(createdAt).toLocaleDateString()}</td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className="w-5 cursor-pointer hover:scale-110 transition"
              alt=""
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}

          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            className="w-5 cursor-pointer hover:scale-110 transition"
            alt=""
          />
        </div>
      </td>
    </tr>
  );
}
