import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/:blogId/comment", addComment);
blogRouter.get("/:blogId/comments", getBlogComments);

blogRouter.post("/generate", auth, generateContent);
blogRouter.post("/", auth, upload.single("image"), addBlog);
blogRouter.delete("/:blogId", auth, deleteBlogById);
blogRouter.patch("/:blogId/publish", auth, togglePublish);

export default blogRouter;
