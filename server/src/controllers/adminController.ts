import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { sendError } from "../utils/sendError.js";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (error) {
    sendError(res, error);
  }
};

export const getAllBlogsAdmin = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    sendError(res, error);
  }
};

export const getAllComments = async (_req: Request, res: Response) => {
  try {
    const comments = await Comment.find().populate("blog").sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    sendError(res, error);
  }
};

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const [recentBlogs, blogs, comments, drafts] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).limit(5),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Blog.countDocuments({ isPublished: false }),
    ]);

    res.json({
      success: true,
      dashboardData: {
        blogs,
        comments,
        drafts,
        recentBlogs,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Comment ID is required" });
      return;
    }

    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

export const approveCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Comment ID is required" });
      return;
    }

    const updated = await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });

    if (!updated) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    res.json({ success: true, message: "Comment approved successfully", comment: updated });
  } catch (error) {
    sendError(res, error);
  }
};
