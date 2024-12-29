"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const Auth_1 = require("../controller/Auth");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/login", Auth_1.login);
exports.authRoutes.post("/signup", Auth_1.signup);
exports.authRoutes.post("/logout", Auth_1.logout);
exports.authRoutes.post("/get_verify_code", Auth_1.getVerifyCode);
exports.authRoutes.post("/check_verify_code", Auth_1.checkVerifyCode);
exports.authRoutes.put("/change_info_after_signup", Auth_1.changeInfoAfterSignup);
