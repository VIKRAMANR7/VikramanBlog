import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CommentTableItem from "../../components/admin/CommentTableItem";

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

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"Approved" | "Not Approved">("Not Approved");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/comments");
      if (data.success) {
        setComments(data.comments || []);
      } else {
        toast.error(data.message || "Failed to load comments");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message || "Failed to load comments");
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

  const approvedCount = useMemo(
    () => comments.filter((c) => c.isApproved === true).length,
    [comments]
  );
  const pendingCount = useMemo(
    () => comments.filter((c) => c.isApproved === false).length,
    [comments]
  );

  const filtered = useMemo(() => {
    if (filter === "Approved") return comments.filter((c) => c.isApproved === true);
    return comments.filter((c) => c.isApproved === false);
  }, [comments, filter]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-800">Comments</h1>

        <div className="flex gap-3" role="tablist" aria-label="Comment filters">
          <button
            type="button"
            onClick={() => setFilter("Approved")}
            aria-pressed={filter === "Approved"}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === "Approved" ? "text-primary border-primary/40" : "text-gray-700"
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("Not Approved")}
            aria-pressed={filter === "Not Approved"}
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
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            {filter === "Approved" ? "No approved comments." : "No pending comments."}
          </div>
        ) : (
          <table className="w-full text-sm text-gray-600">
            <caption className="sr-only">Admin comment moderation table</caption>
            <thead className="text-xs text-gray-700 text-left uppercase">
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-6 py-3">
                  Blog / Comment
                </th>
                <th scope="col" className="px-6 py-3 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comment) => (
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
