import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import User from "../database/models/user.js";

export const register = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const existing = await User.findOne({ where: { email: userData.email } });
    if (existing) {
      return res.status(403).json({ message: "User account already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      ...userData,
      password: hashPassword,
    });
    res.status(201).json({ message: "User account created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.FullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiry,
    });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password`;
    res.status(200).json({
      message: "Password reset token generated",
      resetToken,
      resetUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const candidates = await User.findAll({
      where: {
        resetPasswordToken: { [Op.ne]: null },
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    let user = null;
    for (const candidate of candidates) {
      const tokenMatches = await bcrypt.compare(
        token,
        candidate.resetPasswordToken,
      );
      if (tokenMatches) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
