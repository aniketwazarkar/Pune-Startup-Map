import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Startup } from "../src/models/Startup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "data.json"), "utf8"));

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set — check backend/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await Startup.deleteMany({});
  await Startup.insertMany(data);
  console.log(`Seeded ${data.length} startups.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
