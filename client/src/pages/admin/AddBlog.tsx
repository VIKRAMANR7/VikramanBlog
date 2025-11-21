import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { parse } from "marked";
import { api } from "../../api/axiosInstance";
import { assets, blogCategories } from "../../assets/assets";

export default function AddBlog() {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title.trim()) {
      return toast.error("Please enter a title first");
    }

    try {
      setIsGenerating(true);

      const res = await api.post("/api/blog/generate", {
        prompt: title,
      });

      if (!res.data.success) {
        return toast.error(res.data.message);
      }

      setDescription(res.data.content || "");
    } catch (err) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!image) return toast.error("Please upload an image");
    if (!description.trim()) return toast.error("Blog description cannot be empty");
    if (!category) return toast.error("Please select a category");

    try {
      setIsAdding(true);

      const html = await parse(description);

      const blog = {
        title,
        subtitle,
        description: html,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("image", image);
      formData.append("blog", JSON.stringify(blog));

      const res = await api.post("/api/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data.success) {
        return toast.error(res.data.message);
      }

      toast.success("Blog added successfully ✅");

      // Reset form
      setTitle("");
      setSubtitle("");
      setDescription("");
      setCategory("");
      setIsPublished(false);
      setImage(null);
    } catch {
      toast.error("Failed to add blog");
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>

        <label htmlFor="image" className="cursor-pointer">
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload preview"
            className="mt-2 h-16 rounded"
          />
          <input
            id="image"
            type="file"
            hidden
            accept="image/*"
            required
            onChange={handleImageChange}
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here..."
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none"
        />

        <p className="mt-4">Subtitle</p>
        <input
          type="text"
          placeholder="Type here..."
          value={subtitle}
          required
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none"
        />

        <p className="mt-4">Blog Description</p>
        <textarea
          value={description}
          required
          placeholder="Write your blog content here..."
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-2 p-3 border border-gray-300 rounded outline-none h-[250px] font-mono"
        />

        <div className="flex justify-end pt-4">
          <button
            type="button"
            disabled={isGenerating}
            onClick={generateContent}
            className="text-sm bg-black/80 text-white px-6 py-2 rounded disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <p className="mt-5">Blog Category</p>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 px-3 py-2 border border-gray-300 rounded outline-none"
        >
          <option value="">Select a category</option>

          {blogCategories
            .filter((c) => c !== "All")
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="mt-8 w-40 h-10 bg-primary text-white rounded disabled:opacity-60 cursor-pointer"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
}
