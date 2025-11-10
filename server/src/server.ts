import cors from "cors";
import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import { connectDB } from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app: Express = express();

const requiredEnvs = ["MONGODB_URI", "JWT_SECRET"] as const;
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length) {
  console.error("❌ Missing environment variables:", missingEnvs.join(", "));
  process.exit(1);
}

try {
  await connectDB();
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error(
    "❌ Failed to connect to database:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allowed origins list
      const allowedOrigins = ["http://localhost:5173", "https://vikraman-blog.vercel.app"];

      // ✅ Allow any Vercel preview subdomain
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: Origin not allowed"));
    },
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

export default app;
