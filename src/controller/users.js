import User from "../database/models/user.js";
import bcrypt from "bcrypt";

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
    console.log("All users", users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get single user
export const singleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json("We get user called  ${`user`}");
  } catch {}
};
// create user
export const createUser = async (req, res) => {
  try {
  } catch (error) {}
};
