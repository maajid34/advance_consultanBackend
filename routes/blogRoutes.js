import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from "../controlls/blogController.js";
import { upload } from "../middleware/uploadR2.js";
import { adminOnly, protect } from "../middleware/Auth.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlog);
router.post("/", protect, adminOnly, upload.fields([{ name: "image", maxCount: 1 }, { name: "cover", maxCount: 1 }]), createBlog);
router.put("/:id", protect, adminOnly, upload.fields([{ name: "image", maxCount: 1 }, { name: "cover", maxCount: 1 }]), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;
