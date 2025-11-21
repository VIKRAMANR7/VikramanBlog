import cors from "cors";
import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import { connectDB } from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app: Express = express();

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing environment variables: MONGODB_URI or JWT_SECRET");
  process.exit(1);
}

connectDB().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("❌ Database connection error:", message);
  process.exit(1);
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vikraman-blog.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Vikraman Blog API is running!");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Server Error";
  res.status(500).json({ success: false, message });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
