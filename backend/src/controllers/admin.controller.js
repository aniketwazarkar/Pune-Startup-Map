import { timingSafeEqual } from "crypto";
import { config } from "../config/env.js";

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function login(req, res) {
  if (!config.adminUsername || !config.adminPassword) {
    return res.status(501).json({ error: "Username/password login is not configured on this server." });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const ok = safeEqual(username, config.adminUsername) && safeEqual(password, config.adminPassword);
  if (!ok) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({ token: config.adminToken });
}
