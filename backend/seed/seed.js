import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Startup } from "../src/models/Startup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Seed data comes from `npm run dump`, which writes seed/dump.json from the
// source cluster (DUMP_SOURCE_URI). There is no committed fallback.
const dumpPath = join(__dirname, "dump.json");

if (!existsSync(dumpPath)) {
  console.error("seed/dump.json not found — run `npm run dump` first (requires DUMP_SOURCE_URI).");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dumpPath, "utf8"));

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set — check backend/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await Startup.deleteMany({});
  await Startup.insertMany(data);
  console.log(`Seeded ${data.length} startups from dump.json.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
