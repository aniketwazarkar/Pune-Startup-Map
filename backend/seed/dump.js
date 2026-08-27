import "dotenv/config";
import mongoose from "mongoose";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Startup } from "../src/models/Startup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, "dump.json");

// Source cluster to read from. Defaults to MONGODB_URI so it also works when
// you only have one connection string configured.
const sourceUri = process.env.DUMP_SOURCE_URI || process.env.MONGODB_URI;

async function dump() {
  if (!sourceUri) {
    throw new Error("Set DUMP_SOURCE_URI (or MONGODB_URI) to the source cluster — check backend/.env");
  }

  await mongoose.connect(sourceUri);

  const docs = await Startup.find({}).sort({ createdAt: 1 }).lean();
  const cleaned = docs.map(({ _id, __v, ...rest }) => rest);

  writeFileSync(OUT_FILE, JSON.stringify(cleaned, null, 2) + "\n");

  const byStatus = cleaned.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});
  console.log(`Wrote ${cleaned.length} startups to seed/dump.json`);
  console.log("By status:", byStatus);

  await mongoose.disconnect();
}

dump().catch((err) => {
  console.error(err);
  process.exit(1);
});
