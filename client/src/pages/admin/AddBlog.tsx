import axios from "axios";
import { parse } from "marked";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
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

      const res = await axios.post("/api/blog/generate", {
        prompt: title,
      });

      if (!res.data.success) {
        return toast.error(res.data.message);
      }

      setDescription(res.data.content || "");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message);
      } else {
        toast.error("Failed to generate content");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!image) return toast.error("Please upload an image");

    if (!description.trim()) {
      return toast.error("Blog description cannot be empty");
    }

    if (!category) return toast.error("Please select a category");

    try {
      setIsAdding(true);

      // Convert markdown to HTML
      const htmlDescription = await parse(description);

      const blog = {
        title,
        subtitle,
        description: htmlDescription,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("image", image);
      formData.append("blog", JSON.stringify(blog));

      const res = await axios.post("/api/blog", formData);

      if (!res.data.success) {
        return toast.error(res.data.message);
      }

      toast.success("Blog added successfully ✅");

      setTitle("");
      setSubtitle("");
      setDescription("");
      setCategory("");
      setIsPublished(false);
      setImage(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message);
      } else {
        toast.error("Failed to add blog");
      }
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
            alt="Upload area"
            className="mt-2 h-16 rounded"
          />
          <input
            onChange={handleImageChange}
            type="file"
            id="image"
            hidden
            required
            accept="image/*"
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="mt-4">Subtitle</p>
        <input
          type="text"
          placeholder="Type here..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg">
          <div className="flex flex-col">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your blog content here..."
              required
              className="w-full mt-2 p-3 border border-gray-300 rounded outline-none resize-none h-[250px] font-mono text-md"
            />
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={generateContent}
                disabled={isGenerating}
                className="text-sm bg-black/80 text-white px-6 py-2 rounded hover:bg-black transition disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="size-4 rounded-full border-2 border-t-white border-gray-400 animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5">Blog Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 px-3 py-2 border border-gray-300 rounded outline-none"
          required
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
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-60"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
}
