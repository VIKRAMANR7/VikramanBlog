import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", (error as Error).message);

    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired. Please log in again." });
      return;
    }

    res.status(401).json({ success: false, message: "Invalid or malformed token." });
  }
};

export default auth;
