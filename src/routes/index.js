import express from "express";
import {
  getAllUsers,
  singleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/users.js";
import { protect, authorize } from "../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
userRoutes.get(
  "/getSingleUsers/:id",
  protect,
  authorize("admin", "doctor"),
  singleUser,
);
userRoutes.post("/createUsers", createUser); // No auth for registration
userRoutes.put("/updateUsers/:id", protect, updateUser); // Add ownership check in controller
userRoutes.delete("/deleteUsers/:id", protect, deleteUser);

export default userRoutes;
