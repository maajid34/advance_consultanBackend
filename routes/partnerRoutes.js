import express from "express";
import {
  createPartner,
  deletePartner,
  getPartner,
  getPartners,
  updatePartner,
} from "../controlls/partnerController.js";
import { adminOnly, protect } from "../middleware/Auth.js";
import { upload } from "../middleware/uploadR2.js";

const router = express.Router();

router.get("/", getPartners);
router.get("/:id", getPartner);
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  createPartner
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  updatePartner
);
router.delete("/:id", protect, adminOnly, deletePartner);

export default router;
