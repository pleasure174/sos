import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getNotifications,
  markNotificationRead,
} from "../controller/notifications.js";

const router = express.Router();

router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id/read", protect, markNotificationRead);

export default router;
