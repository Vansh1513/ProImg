import express from "express";
import mongoose from "mongoose";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/send", isAuth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!content || !receiverId) {
      return res.status(400).json({ message: "Content and receiver are required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/conversations", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: { $or: [{ sender: userId }, { receiver: userId }] }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: ["$sender", "$receiver"] },
              then: { sender: "$receiver", receiver: "$sender" },
              else: { sender: "$sender", receiver: "$receiver" }
            }
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $project: {
          userId: {
            $cond: [
              { $eq: ["$_id.sender", userId] },
              "$_id.receiver",
              "$_id.sender"
            ]
          },
          lastMessage: 1
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "messages",
          let: { partnerId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sender", "$$partnerId"] },
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] }
                  ]
                }
              }
            },
            { $count: "unreadCount" }
          ],
          as: "unread"
        }
      },
      {
        $project: {
          user: { _id: 1, name: 1, email: 1 },
          lastMessage: 1,
          unreadCount: { $arrayElemAt: ["$unread.unreadCount", 0] }
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId", isAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender receiver", "name email");

    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
