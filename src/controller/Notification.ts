import { Request, Response } from "express";
import { Op } from "sequelize"; // Import Op
import { Message, Notification } from "../database/models/Notification";
import { Account } from "../database/models/Account";
import { sequelizeConnection } from "../database/db";

async function send_notification(req: Request, res: Response) {
  const { userIds, title, message } = req.body;

  if (!userIds || !title || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const notifications = userIds.map((userId: string) => ({
      userId,
      title,
      message,
      isRead: false,
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({ message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function get_notifications(req: Request, res: Response) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function mark_notification_as_read(req: Request, res: Response) {
  const { notificationId } = req.body;

  if (!notificationId) {
    return res.status(400).json({ message: "Notification ID is required." });
  }

  try {
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    await notification.update({ isRead: true });
    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function get_conversation(req: Request, res: Response) {
  const { userId, otherUserId } = req.body;

  if (!userId || !otherUserId) {
    return res.status(400).json({ message: "User IDs are required." });
  }

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function get_list_conversation(req: Request, res: Response) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const conversations = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      attributes: [
        [
          sequelizeConnection.fn(
            "DISTINCT",
            sequelizeConnection.col("receiverId")
          ),
          "otherUserId",
        ],
      ],
    });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function delete_message(req: Request, res: Response) {
  const { messageId } = req.body;

  if (!messageId) {
    return res.status(400).json({ message: "Message ID is required." });
  }

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    await message.destroy();
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
