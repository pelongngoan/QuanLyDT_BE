import { Request, Response } from "express";
import { Op } from "sequelize"; // Import Op
import { Notification } from "../database/models/Notification";
import { Account } from "../database/models/Account";
import { sequelizeConnection } from "../database/db";
import { Message } from "../database/models/Message";

async function createMessage(req: Request, res: Response) {
  const { userIds, title, message } = req.body;

  if (!userIds || !title || !message) {
    res.status(400).json({ message: "Missing required fields." });
    return;
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

export { send_notification };
