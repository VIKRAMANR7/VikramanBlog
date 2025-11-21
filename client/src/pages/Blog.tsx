import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moment from "moment";
import toast from "react-hot-toast";
import { api } from "../api/axiosInstance";
import { Blog as BlogType } from "../types/blog";
import { assets } from "../assets/assets";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

interface Comment {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

export default function Blog() {
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [blogRes, commentRes] = await Promise.all([
          api.get(`/api/blog/${id}`),
          api.get(`/api/blog/${id}/comments`),
        ]);

        if (blogRes.data.success) setBlog(blogRes.data.blog);
        else toast.error(blogRes.data.message || "Failed to load blog.");

        if (commentRes.data.success) setComments(commentRes.data.comments);
        else toast.error(commentRes.data.message || "Failed to load comments.");
      } catch {
        toast.error("Something went wrong while loading blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addComment = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`/api/blog/${id}/comment`, { name, content });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");

        // refresh comments
        const commentRes = await api.get(`/api/blog/${id}/comments`);
        if (commentRes.data.success) setComments(commentRes.data.comments);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Could not submit comment.");
    }
  };

  if (loading) return <Loader />;

  if (!blog) {
    return (
      <div className="text-center mt-40 text-gray-600">
        <h2 className="text-3xl font-semibold">Blog Not Found</h2>
      </div>
    );
  }

  return (
    <div className="relative">
      <img src={assets.gradientBackground} alt="" className="absolute -top-50 -z-1 opacity-50" />

      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(blog.createdAt).format("MMMM Do YYYY")}
        </p>

        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {blog.title}
        </h1>

        {blog.subtitle && <h2 className="my-5 max-w-lg mx-auto text-gray-600">{blog.subtitle}</h2>}
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto mt-24">
        <img src={blog.image} alt="" className="rounded-3xl mb-5" />

        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        {/* COMMENTS */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>

          <div className="flex flex-col gap-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium">{c.name}</p>
                </div>

                <p className="text-sm max-w-md ml-8">{c.content}</p>

                <span className="absolute right-4 bottom-3 text-xs">
                  {Moment(c.createdAt).fromNow()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ADD COMMENT */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>

          <form onSubmit={addComment} className="flex flex-col gap-4 max-w-lg">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            />

            <button
              type="submit"
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

        {/* SOCIAL SHARE */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">Share this article on social media</p>
          <div className="flex gap-3">
            <img src={assets.facebook_icon} width={50} alt="Facebook" />
            <img src={assets.twitter_icon} width={50} alt="Twitter" />
            <img src={assets.googleplus_icon} width={50} alt="Google+" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
