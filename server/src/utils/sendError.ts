import type { Response } from "express";

export function sendError(res: Response, error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Server error";
  res.status(status).json({ success: false, message });
}
