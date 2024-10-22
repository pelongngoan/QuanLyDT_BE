"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Auth_1 = require("./Auth");
const Class_1 = require("./Class");
exports.router = (0, express_1.Router)();
exports.router.use("/auth", Auth_1.authRoutes);
exports.router.use("/class", Class_1.classRoutes);
