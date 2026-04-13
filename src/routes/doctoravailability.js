import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createAvailability,
  getAvailabilities,
  updateAvailability,
  deleteAvailability,
} from "../controller/doctoravailability.js";

const router = express.Router();

router.post("/availability", protect, authorize("doctor"), createAvailability);
router.get("/availability", protect, getAvailabilities);
router.put(
  "/availability/:id",
  protect,
  authorize("doctor"),
  updateAvailability,
);
router.delete(
  "/availability/:id",
  protect,
  authorize("doctor"),
  deleteAvailability,
);

export default router;
