import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  requestAppointment,
  getAppointments,
  getAppointment,
  cancelAppointment,
} from "../controller/appointments.js";

const router = express.Router();

router.post(
  "/appointments/request",
  protect,
  authorize("patient", "doctor", "admin"),
  requestAppointment,
);
router.get(
  "/appointments",
  protect,
  authorize("patient", "doctor", "admin"),
  getAppointments,
);
router.get(
  "/appointments/:id",
  protect,
  authorize("patient", "doctor", "admin"),
  getAppointment,
);
router.put(
  "/appointments/:id/cancel",
  protect,
  authorize("patient", "doctor", "admin"),
  cancelAppointment,
);

export default router;
