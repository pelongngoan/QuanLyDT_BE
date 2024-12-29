import { Request, Response } from "express";
import { Notification } from "../database/models/Notification";
import { Account } from "../database/models/Account";
import { Message } from "../database/models/Message";
import { Op } from "sequelize";

async function createMessage(req: Request, res: Response) {
  const { senderId, receiverId, content, timestamp } = req.body;

  if (!senderId || !receiverId || !content || !timestamp) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const senderExist = Account.findOne({ where: { id: senderId } });
    if (!senderExist) {
      res.status(404).json({ message: "Người gửi không tồn tại" });
      return;
    }

    const receiverExit = Account.findOne({ where: { id: receiverId } });
    if (!receiverExit) {
      res.status(404).json({ message: "Người nhận không tồn tại" });
      return;
    }

    await Message.create({
      senderId,
      receiverId,
      content,
      timestamp,
    });

    // await Notification.create({
    //   message: content,
    //   type: content,
    //   userId: receiverId,
    //   isRead: false,
    // });

    res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function getConversation(req: Request, res: Response) {
  const { senderId, receiverId } = req.params;

  if (!senderId || !receiverId) {
    res.status(400).json({ message: "Both user IDs are required." });
    return;
  }

  try {
    const conversation = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getListConversation(req: Request, res: Response) {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    console.log("first");

    const conversations = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      // group: ["senderId"],
      order: [["timestamp", "ASC"]],
    });
    console.log("second");

    console.log(conversations);

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteMessage(req: Request, res: Response) {
  const { messageId } = req.params;

  if (!messageId) {
    res.status(400).json({ message: "Message ID is required." });
    return;
  }

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      res.status(404).json({ message: "Message not found." });
      return;
    }

    await message.destroy();

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { createMessage, getConversation, getListConversation, deleteMessage };
