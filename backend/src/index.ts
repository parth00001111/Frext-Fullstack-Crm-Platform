import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import authRouter from "./Routes/authRoutes";
import customerRouter from "./Routes/customerRoutes.ts";
import dealRouter from "./Routes/dealsRoute.ts";
import taskRouter from "./Routes/taskRoutes.ts";
import dashboardRouter from "./Routes/dashBoardRoutes.ts";
import noteRouter from "./Routes/noteRoutes.ts";
import activityRouter from "./Routes/activityRoutes.ts";
import connectDb from "./config/db.ts";

dotenv.config();
const app = express();
const production = process.env.NODE_ENV === "production";
app.disable("etag");
app.disable("x-powered-by");
app.use(express.json());
if (!production) app.use(cors());
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.get("/healthz", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable" });
});
for (const router of [authRouter, customerRouter, dealRouter, taskRouter, dashboardRouter, noteRouter, activityRouter]) {
  app.use("/api/v1", router);
}
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../frontend/dist");
if (production) {
  if (!existsSync(path.join(frontendDist, "index.html"))) {
    throw new Error("Frontend build missing. Run bun run build in frontend first.");
  }
  app.use(express.static(frontendDist));
  app.get("/{*path}", (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (_req, res) => res.json({ message: "server is running" }));
}

async function start() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  await connectDb();
  const port = Number(process.env.PORT || 5000);
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port: ${port}`);
  });
  const shutdown = () => {
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(() => {
      void mongoose.disconnect().then(() => process.exit(0));
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
void start().catch(() => {
  console.error("Startup failed. Check MONGO_URL, JWT_SECRET and database network access.");
  process.exit(1);
});
