"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRoutes = void 0;
const express_1 = require("express");
const Account_1 = require("../controller/Account");
const auth_1 = require("../middleware/auth");
exports.accountRoutes = (0, express_1.Router)();
exports.accountRoutes.get("/get_user_classes/:id", auth_1.authenticate, Account_1.getUserClasses);
exports.accountRoutes.get("/get_user_info/:id", auth_1.authenticate, Account_1.getUserInfo);
exports.accountRoutes.put("/deactivate_user", auth_1.authenticate, Account_1.deactivateUser);
exports.accountRoutes.put("/reactivate_user", auth_1.authenticate, Account_1.reactivateUser);
exports.accountRoutes.put("/set_user_info", auth_1.authenticate, Account_1.setUserInfo);
exports.accountRoutes.put("/set_user_role", auth_1.authenticate, Account_1.setUserRole);
