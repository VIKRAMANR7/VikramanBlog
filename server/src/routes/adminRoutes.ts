import express, { Router } from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const adminRouter: Router = express.Router();

/* PUBLIC ROUTES */
adminRouter.post("/login", adminLogin);

/* PROTECTED ROUTES */
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.patch("/comment/:id/approve", auth, approveCommentById);
adminRouter.delete("/comment/:id", auth, deleteCommentById);

export default adminRouter;
