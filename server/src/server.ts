import cors from "cors";
import "dotenv/config";
import express from "express";

import { validateEnv } from "./configs/validateEnv.js";
import { connectDB } from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

validateEnv();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vikraman-blog.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Vikraman Blog API is running");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
