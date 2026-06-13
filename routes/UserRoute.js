//    // admin login
// router.post("/createAdmin", createAdmin);
// router.post("/customerLogin", AminLogin);

import express from "express";
import {
  deleteUser,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../controlls/userCntrol.js";
import { adminOnly, protect } from "../middleware/Auth.js";
import { loginRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/login", loginRateLimit, loginUser);
router.post("/register", protect, adminOnly, registerUser);
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
