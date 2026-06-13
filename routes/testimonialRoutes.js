import express from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../controlls/testimonialController.js";
import { adminOnly, protect } from "../middleware/Auth.js";
import { upload } from "../middleware/uploadR2.js";

const router = express.Router();

router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "avatar", maxCount: 1 }]),
  createTestimonial
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "avatar", maxCount: 1 }]),
  updateTestimonial
);
router.delete("/:id", protect, adminOnly, deleteTestimonial);

export default router;
