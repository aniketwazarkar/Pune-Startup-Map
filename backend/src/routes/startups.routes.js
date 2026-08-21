import { Router } from "express";
import {
  listApproved,
  listPending,
  createSubmission,
  approveSubmission,
  rejectSubmission,
} from "../controllers/startups.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { submitRateLimit } from "../middleware/submitRateLimit.js";

const router = Router();

router.get("/", listApproved);
router.post("/", submitRateLimit, createSubmission);

router.get("/pending", requireAdmin, listPending);
router.patch("/:id/approve", requireAdmin, approveSubmission);
router.delete("/:id", requireAdmin, rejectSubmission);

export default router;
