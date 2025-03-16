import express from "express";
import { Message } from "../models/messageModel.js";
import mongoose from "mongoose";

const router = express.Router();


router.post("/", async (req, res) => {
  const { chatId, senderId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
    return res.status(400).json({ message: "Invalid chat ID or sender ID" });
  }

  try {
    const message = new Message({ chatId, sender: senderId, text });
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "Invalid chat ID" });
  }

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
