import { Router } from "express";
import { login } from "../controllers/admin.controller.js";
import { loginRateLimit } from "../middleware/loginRateLimit.js";

const router = Router();

router.post("/login", loginRateLimit, login);

export default router;
