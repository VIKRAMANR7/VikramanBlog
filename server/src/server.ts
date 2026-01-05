import cors from "cors";
import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";

import { validateEnv } from "./configs/validateEnv.js";
import { connectDB } from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

validateEnv();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Vikraman Blog API is running");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const startServer = async (): Promise<void> => {
  await connectDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app;
