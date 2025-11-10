import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import groq from "../configs/groq.js";
import imageKit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addBlog = async (req: Request, res: Response) => {
  try {
    if (!req.body.blog) {
      res.status(400).json({ success: false, message: "Blog data missing" });
      return;
    }

    const blogData = JSON.parse(req.body.blog);
    const { title, subtitle = "", description, category, isPublished = true } = blogData;

    if (!title || !description || !category) {
      res.status(400).json({
        success: false,
        message: "Missing required fields (title, description, category)",
      });
      return;
    }

    const imageFile = req.file;

    if (!imageFile) {
      res.status(400).json({ success: false, message: "Image file is required" });
      return;
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResult = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imageKit.url({
      path: uploadResult.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
    });

    fs.unlinkSync(imageFile.path);

    await Blog.create({
      title,
      subtitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID format" });
      return;
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    res.json({ success: true, blog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const deleteBlogById = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID format" });
      return;
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    await Comment.deleteMany({ blog: blogId });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID format" });
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      res.status(400).json({ success: false, message: "Name and content are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid Blog ID format" });
      return;
    }

    const blogExists = await Blog.findById(blogId);

    if (!blogExists) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    await Comment.create({ blog: blogId, name, content });

    res.status(201).json({ success: true, message: "Comment added for review" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const getBlogComments = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      res.status(400).json({ success: false, message: "Invalid blog ID format" });
      return;
    }

    const blogExists = await Blog.findById(blogId);

    if (!blogExists) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ success: false, message });
  }
};

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      res.status(400).json({ success: false, message: "Prompt is required" });
      return;
    }

    const system = `You are an expert blog writer who creates engaging, well-structured articles with proper formatting.`;

    const user = `Write a complete blog article about: "${prompt.trim()}"

CRITICAL FORMATTING RULES:
1. Write ONLY in Markdown format (no HTML tags)
2. Start with ONE main H1 heading: # Title
3. Include 3-5 H2 sections: ## Section Title
4. Use H3 for subsections where needed: ### Subsection
5. LISTS - Include both unordered and numbered
6. Add 2-3 real links
7. Use **bold**, *italics*, and > blockquotes
8. 700–1000 words total
9. No AI disclaimers or meta text
10. Keep paragraphs short and conversational`;

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

    let content = markdown;
    const hasH1 = /^#\s+.+/m.test(content);
    const hasH2 = /^##\s+.+/m.test(content);
    const hasBullets = /(^|\n)[-*]\s+.+/m.test(content);
    const hasNumbered = /(^|\n)\d+\.\s+.+/m.test(content);
    const hasValidLink = /\[.+?\]\(https?:\/\/.+?\)/.test(content);

    if (!hasH1) content = `# ${prompt.trim()}\n\n${content}`;
    if (!hasH2) content += `\n\n## Overview\n\nThis section provides insights on ${prompt}.`;
    if (!hasBullets) content += `\n\n- Key ideas\n- Common use cases\n- Best practices`;
    if (!hasNumbered) content += `\n\n1. Learn\n2. Practice\n3. Implement\n4. Refine`;
    if (!hasValidLink) {
      const topic = prompt.trim().replace(/\s+/g, "_");
      content += `\n\n> **Further Reading:** [${prompt} on Wikipedia](https://en.wikipedia.org/wiki/${topic})`;
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("AI Content Generation Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate content";
    res.status(500).json({ success: false, message });
  }
};
