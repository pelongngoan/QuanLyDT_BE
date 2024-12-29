import { Request, Response } from "express";
import { Notification } from "../database/models/Notification";

async function sendNotification(req: Request, res: Response) {
  const { message, type, userId } = req.body;

  if (!message || !userId) {
    res.status(400).json({ message: "Message and userId are required." });
    return;
  }

  try {
    const notification = await Notification.create({
      message,
      type,
      userId,
    });

    res
      .status(201)
      .json({ message: "Notification sent successfully.", notification });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getNotifications(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const notifications = await Notification.findAll({ where: { userId } });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function markMotificationAsRead(req: Request, res: Response) {
  const { notificationId } = req.params;

  if (!notificationId) {
    res.status(400).json({ message: "Notification ID is required." });
    return;
  }

  try {
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      res.status(404).json({ message: "Notification not found." });
      return;
    }

    await notification.update({ isRead: true });

    res
      .status(200)
      .json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { sendNotification, getNotifications, markMotificationAsRead };
