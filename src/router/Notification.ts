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

const router = Router();

router.post("/send", authenticate, send_notification);
router.get("/get/:id", authenticate, get_notifications);
router.put("/mark_as_read/:id", authenticate, mark_notification_as_read);
router.get("/conversation/:id", authenticate, get_conversation);
router.get("/conversations/:id", authenticate, get_list_conversation);
router.delete("/delete_message/:id", authenticate, delete_message);

export default router;
