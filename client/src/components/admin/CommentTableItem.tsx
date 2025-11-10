import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

interface Comment {
  _id: string;
  blog: {
    _id: string;
    title: string;
  };
  name: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

interface CommentTableItemProps {
  comment: Comment;
  fetchComments: () => Promise<void>;
}

export default function CommentTableItem({ comment, fetchComments }: CommentTableItemProps) {
  const { blog, createdAt, _id, isApproved, name, content } = comment;
  const BlogDate = new Date(createdAt);

  const approveComment = async () => {
    try {
      const { data } = await axios.patch(`/api/admin/comment/${_id}/approve`);
      if (data.success) {
        toast.success(data.message || "Comment approved");
        await fetchComments();
      } else {
        toast.error(data.message || "Failed to approve");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to approve comment");
      }
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this comment?");
      if (!confirm) return;

      const { data } = await axios.delete(`/api/admin/comment/${_id}`);
      if (data.success) {
        toast.success(data.message || "Comment deleted");
        await fetchComments();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to delete comment");
      }
    }
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog?.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">{BlogDate.toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              alt="Approve"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
}
