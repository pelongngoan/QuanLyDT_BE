"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_notification = send_notification;
exports.get_notifications = get_notifications;
exports.mark_notification_as_read = mark_notification_as_read;
exports.get_conversation = get_conversation;
exports.get_list_conversation = get_list_conversation;
exports.delete_message = delete_message;
const sequelize_1 = require("sequelize"); // Import Op
const Notification_1 = require("../database/models/Notification");
const db_1 = require("../database/db");
const Message_1 = require("../database/models/Message");
function send_notification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userIds, title, message } = req.body;
        if (!userIds || !title || !message) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const notifications = userIds.map((userId) => ({
                userId,
                title,
                message,
                isRead: false,
            }));
            yield Notification_1.Notification.bulkCreate(notifications);
            res.status(201).json({ message: "Notifications sent successfully." });
        }
        catch (error) {
            console.error("Error sending notifications:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function get_notifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }
        try {
            const notifications = yield Notification_1.Notification.findAll({
                where: { userId },
                order: [["createdAt", "DESC"]],
            });
            res.status(200).json({ notifications });
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function mark_notification_as_read(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { notificationId } = req.body;
        if (!notificationId) {
            res.status(400).json({ message: "Notification ID is required." });
            return;
        }
        try {
            const notification = yield Notification_1.Notification.findByPk(notificationId);
            if (!notification) {
                res.status(404).json({ message: "Notification not found." });
                return;
            }
            yield notification.update({ isRead: true });
            res.status(200).json({ message: "Notification marked as read." });
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function get_conversation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, otherUserId } = req.body;
        if (!userId || !otherUserId) {
            res.status(400).json({ message: "User IDs are required." });
            return;
        }
        try {
            const messages = yield Message_1.Message.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId },
                    ],
                },
                order: [["createdAt", "ASC"]],
            });
            res.status(200).json({ messages });
        }
        catch (error) {
            console.error("Error fetching conversation:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function get_list_conversation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }
        try {
            const conversations = yield Message_1.Message.findAll({
                where: { [sequelize_1.Op.or]: [{ senderId: userId }, { receiverId: userId }] },
                attributes: [
                    [
                        db_1.sequelizeConnection.fn("DISTINCT", db_1.sequelizeConnection.col("receiverId")),
                        "otherUserId",
                    ],
                ],
            });
            res.status(200).json({ conversations });
        }
        catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function delete_message(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { messageId } = req.body;
        if (!messageId) {
            res.status(400).json({ message: "Message ID is required." });
            return;
        }
        try {
            const message = yield Message_1.Message.findByPk(messageId);
            if (!message) {
                res.status(404).json({ message: "Message not found." });
                return;
            }
            yield message.destroy();
            res.status(200).json({ message: "Message deleted successfully." });
        }
        catch (error) {
            console.error("Error deleting message:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
