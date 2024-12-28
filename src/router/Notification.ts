import { Router } from "express";
import {
  send_notification,
  get_notifications,
  mark_notification_as_read,
  get_conversation,
  get_list_conversation,
  delete_message,
} from "../controller/Notification";
import { authenticate } from "../middleware/auth";

export const notificationRoutes = Router();

notificationRoutes.post("/send", authenticate, send_notification);
notificationRoutes.get("/get/:notificationId", authenticate, get_notifications);
notificationRoutes.put(
  "/markAsRead/:notificationId",
  authenticate,
  mark_notification_as_read
);
notificationRoutes.get(
  "/conversation/:notificationId",
  authenticate,
  get_conversation
);
notificationRoutes.get(
  "/conversations/:userId",
  authenticate,
  get_list_conversation
);
notificationRoutes.delete(
  "/delete_message/:notificationId",
  authenticate,
  delete_message
);
