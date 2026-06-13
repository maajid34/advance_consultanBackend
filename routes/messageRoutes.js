import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  markMessageRead,
} from "../controlls/messageController.js";
import { adminOnly, protect } from "../middleware/Auth.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/", protect, adminOnly, getMessages);
router.put("/:id/read", protect, adminOnly, markMessageRead);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
