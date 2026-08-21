import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import startupsRouter from "./routes/startups.routes.js";
import adminRouter from "./routes/admin.routes.js";

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/startups", startupsRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
