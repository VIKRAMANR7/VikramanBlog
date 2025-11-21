import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Express.UserPayload;

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired. Please log in again." });
      return;
    }

    res.status(401).json({ success: false, message: "Invalid or malformed token." });
  }
};

export default auth;
