import { motion } from "motion/react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { blogCategories } from "../assets/assets";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();
  const filteredBlogs = () => {
    if (input === "") {
      return blogs;
    }
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((category) => (
          <div key={category} className="relative">
            <button
              onClick={() => setMenu(category)}
              className={`cursor-pointer text-gray-500 ${
                menu === category && "text-white px-4 pt-0.5"
              }`}
            >
              {category}
              {menu === category && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs()
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  );
}
