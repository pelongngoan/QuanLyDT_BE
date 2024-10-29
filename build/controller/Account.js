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
exports.getUserInfo = getUserInfo;
exports.setUserInfo = setUserInfo;
exports.getUserClasses = getUserClasses;
exports.setUserRole = setUserRole;
exports.deactivateUser = deactivateUser;
exports.reactivateUser = reactivateUser;
const Account_1 = require("../database/models/Account");
const Class_1 = require("../database/models/Class");
const Notification_1 = require("../database/models/Notification");
const Message_1 = require("../database/models/Message");
function getUserInfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const user = yield Account_1.Account.findOne({
                where: { id: userId },
                include: [Notification_1.Notification, Message_1.Message],
            });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(200).json({ user });
        }
        catch (error) {
            next(error);
        }
    });
}
// Update user information
function setUserInfo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { firstName, lastName, avatar } = req.body;
        try {
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            yield user.update({
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                avatar: avatar || user.avatar,
            });
            res.status(200).json({ message: "User info updated successfully!", user });
        }
        catch (error) {
            next(error);
        }
    });
}
// Retrieve classes for the user (teacher role)
function getUserClasses(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const classes = yield Class_1.Class.findAll({
                where: { teacherId: userId },
            });
            res.status(200).json({ classes });
        }
        catch (error) {
            next(error);
        }
    });
}
// Set user role (admin-only)
function setUserRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const adminRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const { userId, role } = req.body;
        if (adminRole !== Account_1.ROLE.ADMIN) {
            res
                .status(403)
                .json({ message: "Access denied. Only admin can set roles." });
            return;
        }
        try {
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            yield user.update({ role });
            res.status(200).json({ message: "User role updated successfully!" });
        }
        catch (error) {
            next(error);
        }
    });
}
// Deactivate user (admin-only)
function deactivateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const adminRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const { userId } = req.body;
        if (adminRole !== Account_1.ROLE.ADMIN) {
            res
                .status(403)
                .json({ message: "Access denied. Only admin can deactivate users." });
            return;
        }
        try {
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            yield user.update({ state: Account_1.STATE.LOCKED });
            res.status(200).json({ message: "User deactivated successfully!" });
        }
        catch (error) {
            next(error);
        }
    });
}
// Reactivate user (admin-only)
function reactivateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const adminRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const { userId } = req.body;
        if (adminRole !== Account_1.ROLE.ADMIN) {
            res
                .status(403)
                .json({ message: "Access denied. Only admin can reactivate users." });
            return;
        }
        try {
            const user = yield Account_1.Account.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            yield user.update({ state: Account_1.STATE.ACTIVE });
            res.status(200).json({ message: "User reactivated successfully!" });
        }
        catch (error) {
            next(error);
        }
    });
}
