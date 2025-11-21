import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { api } from "../../api/axiosInstance";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { Comment } from "../../types/comment";

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"Approved" | "Not Approved">("Not Approved");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/admin/comments");

      if (data.success) {
        setComments(data.comments || []);
      } else {
        toast.error(data.message || "Failed to load comments");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to load comments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const approvedCount = useMemo(() => comments.filter((c) => c.isApproved).length, [comments]);

  const pendingCount = useMemo(() => comments.filter((c) => !c.isApproved).length, [comments]);

  const filteredComments = useMemo(() => {
    return filter === "Approved"
      ? comments.filter((c) => c.isApproved)
      : comments.filter((c) => !c.isApproved);
  }, [comments, filter]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-800">Comments</h1>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFilter("Approved")}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Approved" ? "text-primary border-primary/40" : "text-gray-700"
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("Not Approved")}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Not Approved" ? "text-primary border-primary/40" : "text-gray-700"
            }`}
          >
            Not Approved ({pendingCount})
          </button>
        </div>
      </div>

      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            Loading comments…
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            {filter === "Approved" ? "No approved comments." : "No pending comments."}
          </div>
        ) : (
          <table className="w-full text-sm text-gray-600">
            <thead className="text-xs text-gray-700 text-left uppercase">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3">Blog / Comment</th>
                <th className="px-6 py-3 max-sm:hidden">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComments.map((comment) => (
                <CommentTableItem
                  key={comment._id}
                  comment={comment}
                  fetchComments={fetchComments}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
