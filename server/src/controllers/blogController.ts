import type { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";

import groq from "../configs/groq.js";
import imageKit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { sendError } from "../utils/sendError.js";
import { buildBlogPrompt } from "../utils/buildBlogPrompt.js";
import { fixMarkdown } from "../utils/fixMarkdown.js";

export async function addBlog(req: Request, res: Response) {
  try {
    if (!req.body.blog) {
      return res.status(400).json({ success: false, message: "Blog data missing" });
    }

    const blogData = JSON.parse(req.body.blog);
    const { title, subtitle = "", description, category, isPublished = true } = blogData;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploaded = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimized = imageKit.url({
      path: uploaded.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
    });

    fs.unlinkSync(imageFile.path);

    await Blog.create({
      title,
      subtitle,
      description,
      category,
      image: optimized,
      isPublished,
    });

    return res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getAllBlogs(_req: Request, res: Response) {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getBlogById(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, blog });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function deleteBlogById(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const deleted = await Blog.findByIdAndDelete(blogId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Comment.deleteMany({ blog: blogId });

    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function togglePublish(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    return res.json({
      success: true,
      message: "Blog status updated",
      isPublished: blog.isPublished,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const { blogId } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({ success: false, message: "Name and content are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Comment.create({ blog: blogId, name, content });

    return res.status(201).json({ success: true, message: "Comment added for review" });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getBlogComments(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });

    return res.json({ success: true, comments });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function generateContent(req: Request, res: Response) {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const { system, user } = buildBlogPrompt(prompt);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      max_tokens: 2500,
    });

    const markdown = completion?.choices?.[0]?.message?.content ?? "";

    if (!markdown) {
      return res.status(500).json({ success: false, message: "AI did not return content" });
    }

    const fixedContent = fixMarkdown(prompt, markdown);

    return res.json({ success: true, content: fixedContent });
  } catch (err) {
    return sendError(res, err);
  }
}
