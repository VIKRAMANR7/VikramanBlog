import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Blog } from "../types/blog";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const navigate = useNavigate();
  const { title, subtitle, category, image, _id } = blog;

  const goToBlog = useCallback(() => {
    navigate(`/blog/${_id}`);
  }, [navigate, _id]);

  return (
    <div
      tabIndex={0}
      onClick={goToBlog}
      onKeyDown={(e) => e.key === "Enter" && goToBlog()}
      className="w-full rounded-lg overflow-hidden shadow hover:shadow-primary/25 hover:scale-105 transition cursor-pointer outline-none focus:ring-2 focus:ring-primary"
    >
      <img src={image} alt={title} className="aspect-video" />

      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category}
      </span>

      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}
