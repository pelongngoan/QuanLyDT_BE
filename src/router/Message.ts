import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getConversation,
  getListConversation,
} from "../controller/Message";
import { authenticate } from "../middleware/auth";

export const messageRoutes = Router();

messageRoutes.post("/send", authenticate, createMessage);
messageRoutes.get("/get/:senderId/:receiverId", authenticate, getConversation);
messageRoutes.get("/getList/:userId", authenticate, getListConversation);
messageRoutes.delete("/delete/:messageId", authenticate, deleteMessage);
