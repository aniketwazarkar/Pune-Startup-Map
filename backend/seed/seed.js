import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Startup } from "../src/models/Startup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Prefer a real dump from `npm run dump` if present; fall back to the curated
// data.json that's committed for anyone without source-cluster access.
const dumpPath = join(__dirname, "dump.json");
const dataPath = join(__dirname, "data.json");
const sourcePath = existsSync(dumpPath) ? dumpPath : dataPath;
const data = JSON.parse(readFileSync(sourcePath, "utf8"));

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set — check backend/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await Startup.deleteMany({});
  await Startup.insertMany(data);
  console.log(`Seeded ${data.length} startups from ${sourcePath.endsWith("dump.json") ? "dump.json" : "data.json"}.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
