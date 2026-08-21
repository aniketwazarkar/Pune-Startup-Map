import "dotenv/config";

const required = ["MONGODB_URI", "LOGO_DEV_TOKEN", "ADMIN_TOKEN"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key} (check backend/.env against .env.example)`);
  }
}

export const config = Object.freeze({
  mongodbUri: process.env.MONGODB_URI,
  logoDevToken: process.env.LOGO_DEV_TOKEN,
  adminToken: process.env.ADMIN_TOKEN,
  adminUsername: process.env.ADMIN_USERNAME || null,
  adminPassword: process.env.ADMIN_PASSWORD || null,
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
});
