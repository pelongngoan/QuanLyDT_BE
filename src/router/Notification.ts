import { Router } from "express";
import {
  getNotifications,
  markMotificationAsRead,
  sendNotification,
} from "../controller/Notification";
import { authenticate } from "../middleware/auth";

export const notificationRoutes = Router();

notificationRoutes.post("/send", authenticate, sendNotification);
notificationRoutes.get("/getList/:userId", authenticate, getNotifications);
notificationRoutes.put(
  "/markAsRead/:notificationId",
  authenticate,
  markMotificationAsRead
);
