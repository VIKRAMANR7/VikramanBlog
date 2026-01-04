import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Express.UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired" });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}
