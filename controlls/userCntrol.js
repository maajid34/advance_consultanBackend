import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModels.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const isActiveAdmin = (user) => user.role === "admin" && user.status !== "inactive";

export const registerUser = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "Database not connected. Check MONGO_URI and MongoDB Atlas network access.",
      });
    }

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role === "admin" ? "admin" : "user";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: "active",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "Database not connected. Check MONGO_URI and MongoDB Atlas network access.",
      });
    }

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).maxTimeMS(5000);
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ message: "This account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .maxTimeMS(5000);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasActiveAdmin = isActiveAdmin(user);
    const nextRole = req.body.role !== undefined ? (req.body.role === "admin" ? "admin" : "user") : user.role;
    const nextStatus =
      req.body.status !== undefined
        ? req.body.status === "inactive"
          ? "inactive"
          : "active"
        : user.status;
    const willRemainActiveAdmin = nextRole === "admin" && nextStatus !== "inactive";

    if (wasActiveAdmin && !willRemainActiveAdmin) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        status: { $ne: "inactive" },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: "Cannot remove or disable the last active admin account",
        });
      }
    }

    if (req.body.name !== undefined) user.name = req.body.name.trim();
    if (req.body.email !== undefined) user.email = req.body.email.trim().toLowerCase();
    if (req.body.role !== undefined) user.role = nextRole;
    if (req.body.status !== undefined) {
      user.status = nextStatus;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      user.password = req.body.password;
    }

    if (!user.name || !user.email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const updated = await user.save();

    res.json({
      success: true,
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: error.message || "Update failed" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user?._id?.toString() === user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    if (isActiveAdmin(user)) {
      const activeAdminCount = await User.countDocuments({
        role: "admin",
        status: { $ne: "inactive" },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last active admin account",
        });
      }
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Delete failed" });
  }
};
