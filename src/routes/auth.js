import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controller/auth.js";

const authRoutes = express.Router();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
