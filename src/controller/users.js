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
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};
// create user
export const createUser = async (req, res) => {
  try {
    const users = await userModel.findAll();
    if(!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
    console.log("All users", users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const findUser = await User.findByPk(req.params.id);
return res.status(404).json({ message: "user not found" });

const {userData} = req.body;
await findUser.update(userData);
res.status(200).json({ message: "user updated successfully" });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!deluser) 
      res.status(404).json({ message: "user not found" });
    await user.destroy();
    res.status(200).json({ message: "user deleted successfully" });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};
