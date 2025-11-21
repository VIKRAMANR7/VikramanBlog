import { motion } from "motion/react";
import { useMemo, useState, useCallback } from "react";
import { useAppContext } from "../context/useAppContext";
import { blogCategories } from "../assets/assets";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [menu, setMenu] = useState<string>("All");
  const { blogs, input } = useAppContext();

  const onSelectCategory = useCallback((cat: string) => {
    setMenu(cat);
  }, []);

  const filteredBlogs = useMemo(() => {
    if (!input?.trim()) return blogs;

    const search = input.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search) || blog.category.toLowerCase().includes(search)
    );
  }, [blogs, input]);

  const displayed = useMemo(
    () => filteredBlogs.filter((b) => (menu === "All" ? true : b.category === menu)),
    [filteredBlogs, menu]
  );

  return (
    <section>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((category) => {
          const isActive = menu === category;
          return (
            <div key={category} className="relative">
              <button
                onClick={() => onSelectCategory(category)}
                className={`cursor-pointer text-gray-500 ${isActive ? "text-white px-4 pt-0.5" : ""}`}
              >
                {category}

                {isActive && (
                  <motion.div
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {displayed.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
