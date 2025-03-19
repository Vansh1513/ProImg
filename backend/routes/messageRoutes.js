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

    const newMessage = new Message({ 
      sender: senderId, 
      receiver: receiverId, 
      content,
      read: false,
      createdAt: new Date()
    });
    
    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    const io = req.app.get("io");
    if (io) {
      io.to(receiverId.toString()).emit("receiveMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/conversations", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Message.aggregate([
      {
        $match: { 
          $or: [
            { sender: userObjectId }, 
            { receiver: userObjectId }
          ] 
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userObjectId] },
              then: "$receiver",
              else: "$sender"
            }
          },
          lastMessage: { $first: "$$ROOT" },
          messages: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $addFields: {
          unreadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.receiver", userObjectId] },
                    { $eq: ["$$message.read", false] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            avatar: { $ifNull: ["$userDetails.avatar", null] }
          },
          lastMessage: 1,
          unreadCount: 1,
          lastActivity: "$lastMessage.createdAt"
        }
      },
      { $sort: { lastActivity: -1 } }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    const unreadMessages = await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { read: true }
    );

    if (unreadMessages.modifiedCount > 0) {
      const io = req.app.get("io");
      if (io) {
        io.to(otherUserId.toString()).emit("messagesRead", currentUserId.toString());
      }
    }

    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/read/:messageId", isAuth, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to mark this message as read" });
    }

    if (!message.read) {
      message.read = true;
      await message.save();

      const io = req.app.get("io");
      if (io) {
        io.to(message.sender.toString()).emit("messageReadUpdate", messageId);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:messageId", isAuth, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    const io = req.app.get("io");
    if (io) {
      io.to(message.receiver.toString()).emit("messageDeleted", messageId);
    }

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;