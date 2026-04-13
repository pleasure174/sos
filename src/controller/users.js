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
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// create user
export const createUser = async (req, res) => {
  try {
    const {
      FullName,
      email,
      phonenumber,
      password,
      location,
      role,
      date_of_birth,
      gender,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      FullName,
      email,
      phonenumber,
      password: hashedPassword,
      location,
      role: role || "patient",
      date_of_birth,
      gender,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const findUser = await User.findByPk(req.params.id);
    if (!findUser) {
      return res.status(404).json({ message: "user not found" });
    }
    // Check if user is updating themselves or is admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }
    const userData = req.body;
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await findUser.update(userData);
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // Allow self deletion or admin deletion
    if (
      String(req.user.id) !== String(req.params.id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }
    await user.destroy();
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
