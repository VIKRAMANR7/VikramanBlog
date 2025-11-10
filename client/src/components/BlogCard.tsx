import { useNavigate } from "react-router-dom";
import { Blog } from "../../context/AppContext";

export default function BlogCard({ blog }: { blog: Blog }) {
  const { title, subtitle, category, image, _id } = blog;
  const navigate = useNavigate();

  const goToBlog = () => navigate(`/blog/${_id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToBlog()}
      onClick={goToBlog}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-primary"
    >
      <img src={image} alt={title} className="aspect-video" />

      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category}
      </span>

      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>

        {subtitle && <p className="mb-3 text-xs text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}
