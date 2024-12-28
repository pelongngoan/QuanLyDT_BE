"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Auth_1 = require("./Auth");
const Class_1 = require("./Class");
const Survey_1 = require("./Survey");
const Account_1 = require("./Account");
const Assignment_1 = require("./Assignment");
const Attendance_1 = require("./Attendance");
const Session_1 = require("./Session");
const AbsenceRequest_1 = require("./AbsenceRequest");
exports.router = (0, express_1.Router)();
exports.router.use("/auth", Auth_1.authRoutes);
exports.router.use("/class", Class_1.classRoutes);
exports.router.use("/account", Account_1.accountRoutes);
exports.router.use("/assignment", Assignment_1.assignmentRoutes);
exports.router.use("/survey", Survey_1.surveyRouter);
exports.router.use("/attendance", Attendance_1.attendanceRoutes);
exports.router.use("/session", Session_1.sessionRoutes);
exports.router.use("/absence", AbsenceRequest_1.absenceRequestRoutes);
