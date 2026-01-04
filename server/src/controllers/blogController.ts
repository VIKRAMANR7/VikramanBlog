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

export async function addBlog(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.blog) {
      res.status(400).json({ success: false, message: "Blog data missing" });
      return;
    }

    const blogData = JSON.parse(req.body.blog);
    const { title, subtitle = "", description, category, isPublished = true } = blogData;

    if (!title || !description || !category) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const imageFile = req.file;

    if (!imageFile) {
      res.status(400).json({ success: false, message: "Image file is required" });
      return;
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

    res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    sendError(res, err);
  }
}

export async function getAllBlogs(_req: Request, res: Response): Promise<void> {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    sendError(res, err);
  }
}

export async function getBlogById(req: Request, res: Response): Promise<void> {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID" });
      return;
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    res.json({ success: true, blog });
  } catch (err) {
    sendError(res, err);
  }
}

export async function deleteBlogById(req: Request, res: Response): Promise<void> {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID" });
      return;
    }

    const deleted = await Blog.findByIdAndDelete(blogId);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    await Comment.deleteMany({ blog: blogId });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    sendError(res, err);
  }
}

export async function togglePublish(req: Request, res: Response): Promise<void> {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID" });
      return;
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      success: true,
      message: "Blog status updated",
      isPublished: blog.isPublished,
    });
  } catch (err) {
    sendError(res, err);
  }
}

export async function addComment(req: Request, res: Response): Promise<void> {
  try {
    const { blogId } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      res.status(400).json({ success: false, message: "Name and content are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID" });
      return;
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    await Comment.create({ blog: blogId, name, content });

    res.status(201).json({ success: true, message: "Comment added for review" });
  } catch (err) {
    sendError(res, err);
  }
}

export async function getBlogComments(req: Request, res: Response): Promise<void> {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID" });
      return;
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    sendError(res, err);
  }
}

export async function generateContent(req: Request, res: Response): Promise<void> {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
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
      res.status(500).json({ success: false, message: "AI did not return content" });
      return;
    }

    const fixedContent = fixMarkdown(prompt, markdown);

    res.json({ success: true, content: fixedContent });
  } catch (err) {
    sendError(res, err);
  }
}
