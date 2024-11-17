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
exports.get_attendance_list = get_attendance_list;
exports.get_attendance_record = get_attendance_record;
exports.set_attendance_status = set_attendance_status;
exports.take_attendance = take_attendance;
const Attendance_1 = require("../database/models/Attendance");
const Session_1 = require("../database/models/Session");
const Student_1 = require("../database/models/Student");
// Record attendance
function take_attendance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionId, studentId, status, date } = req.body;
        if (!sessionId || !studentId || !status || !date) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            // Ensure the session and student exist
            const sessionExists = yield Session_1.Session.findByPk(sessionId);
            const studentExists = yield Student_1.Student.findByPk(studentId);
            if (!sessionExists || !studentExists) {
                res.status(404).json({ message: "Session or student not found." });
                return;
            }
            const attendanceRecord = yield Attendance_1.Attendance.create({
                sessionId,
                studentId,
                isPresent: status.toLowerCase() === "present",
                date,
            });
            res.status(201).json({
                message: "Attendance recorded successfully!",
                attendance: attendanceRecord,
            });
        }
        catch (error) {
            console.error("Error recording attendance: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Retrieve a specific attendance record
function get_attendance_record(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionId, studentId, date } = req.query;
        if (!sessionId || !studentId || !date) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const attendanceRecord = yield Attendance_1.Attendance.findOne({
                where: { sessionId, studentId, date },
            });
            if (!attendanceRecord) {
                res.status(404).json({ message: "Attendance record not found." });
                return;
            }
            res.status(200).json({ attendance: attendanceRecord });
        }
        catch (error) {
            console.error("Error fetching attendance record: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Update attendance status
function set_attendance_status(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionId, studentId, date, status } = req.body;
        if (!sessionId || !studentId || !date || !status) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const attendanceRecord = yield Attendance_1.Attendance.findOne({
                where: { sessionId, studentId, date },
            });
            if (!attendanceRecord) {
                res.status(404).json({ message: "Attendance record not found." });
                return;
            }
            attendanceRecord.isPresent = status.toLowerCase() === "present";
            yield attendanceRecord.save();
            res.status(200).json({
                message: "Attendance status updated successfully!",
                attendance: attendanceRecord,
            });
        }
        catch (error) {
            console.error("Error updating attendance status: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get all attendance records for a specific session and date
function get_attendance_list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sessionId, date } = req.query;
        if (!sessionId || !date) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const attendanceList = yield Attendance_1.Attendance.findAll({
                where: { sessionId, date },
            });
            if (attendanceList.length === 0) {
                res
                    .status(404)
                    .json({ message: "No attendance records found for this date." });
                return;
            }
            res.status(200).json({ attendanceList });
        }
        catch (error) {
            console.error("Error fetching attendance list: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
