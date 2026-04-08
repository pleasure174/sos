import express from "express";
import { getAllUsers,singleUser, createUser,updateUser,deleteUser } from "../controllers/userController.js";
const router = express.Router();
router.get("api/getAllUsers", getAllUsers);
router.get("api/getSingleUsers/:id", singleUser);
router.post("api/createUsers", createUser);
router.put("api/updateUsers/:id", updateUser);
router.delete("api/deleteUsers/:id", deleteUser);


export default router;