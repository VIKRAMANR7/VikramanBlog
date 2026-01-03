import { motion } from "motion/react";
import { useState } from "react";

import { useAppContext } from "../context/useAppContext";
import { blogCategories } from "../assets/assets";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();

  const filteredBlogs = input?.trim()
    ? blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(input.toLowerCase()) ||
          blog.category.toLowerCase().includes(input.toLowerCase())
      )
    : blogs;

  const displayed =
    menu === "All" ? filteredBlogs : filteredBlogs.filter((b) => b.category === menu);

  return (
    <section>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((category) => {
          const isActive = menu === category;
          return (
            <div key={category} className="relative">
              <button
                onClick={() => setMenu(category)}
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
