// deploy check: backend
import { config } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import { app } from "./app.js";

async function main() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Backend listening on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
