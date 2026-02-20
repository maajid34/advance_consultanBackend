import express from "express";
import {
  createCategory,
  getCategories,
} from "../controlls/categoryController.js";

import { protect, adminOnly } from "../middleware/Auth.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);

export default router;
