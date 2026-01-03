import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { sendError } from "../utils/sendError.js";

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return res.json({ success: true, token });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getAllBlogsAdmin(_req: Request, res: Response) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json({ success: true, blogs });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getAllComments(_req: Request, res: Response) {
  try {
    const comments = await Comment.find().populate("blog").sort({ createdAt: -1 });
    return res.json({ success: true, comments });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function getDashboard(_req: Request, res: Response) {
  try {
    const [recentBlogs, blogs, comments, drafts] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).limit(5),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Blog.countDocuments({ isPublished: false }),
    ]);

    return res.json({
      success: true,
      dashboardData: { blogs, comments, drafts, recentBlogs },
    });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function deleteCommentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Comment ID is required" });
    }

    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    return res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    return sendError(res, err);
  }
}

export async function approveCommentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Comment ID is required" });
    }

    const updated = await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    return res.json({ success: true, message: "Comment approved", comment: updated });
  } catch (err) {
    return sendError(res, err);
  }
}
