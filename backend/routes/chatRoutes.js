import express from "express";
import { Chat } from "../models/chatModel.js";
import mongoose from "mongoose";

const router = express.Router();


router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid user ID(s)" });
  }

  try {
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ members: [senderId, receiverId] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
