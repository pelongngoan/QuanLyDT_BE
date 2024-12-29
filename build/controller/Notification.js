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
exports.sendNotification = sendNotification;
exports.getNotifications = getNotifications;
exports.markMotificationAsRead = markMotificationAsRead;
const Notification_1 = require("../database/models/Notification");
function sendNotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, type, userId } = req.body;
        if (!message || !userId) {
            res.status(400).json({ message: "Message and userId are required." });
            return;
        }
        try {
            const notification = yield Notification_1.Notification.create({
                message,
                type,
                userId,
            });
            res
                .status(201)
                .json({ message: "Notification sent successfully.", notification });
        }
        catch (error) {
            console.error("Error sending notification:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function getNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "User ID is required." });
            return;
        }
        try {
            const notifications = yield Notification_1.Notification.findAll({ where: { userId } });
            res.status(200).json({ notifications });
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function markMotificationAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { notificationId } = req.params;
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
            res
                .status(200)
                .json({ message: "Notification marked as read.", notification });
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
