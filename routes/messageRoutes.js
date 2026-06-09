import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  markMessageRead,
} from "../controlls/messageController.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/", getMessages);
router.put("/:id/read", markMessageRead);
router.delete("/:id", deleteMessage);

export default router;
