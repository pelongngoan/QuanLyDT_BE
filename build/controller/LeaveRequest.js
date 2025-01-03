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
exports.getAllAbsenceByClassId = getAllAbsenceByClassId;
exports.request_absence = request_absence;
exports.review_absence_request = review_absence_request;
exports.getAbsenceById = getAbsenceById;
const LeaveRequest_1 = require("../database/models/LeaveRequest");
const Student_1 = require("../database/models/Student");
const Class_1 = require("../database/models/Class");
// Submit absence request
function request_absence(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { studentId, classId, startDate, endDate, reason } = req.body;
        if (!studentId || !classId || !startDate || !endDate || !reason) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const studentExists = yield Student_1.Student.findByPk(studentId);
            const classExists = yield Class_1.Class.findByPk(classId);
            if (!studentExists || !classExists) {
                res.status(404).json({ message: "Student or class not found." });
                return;
            }
            const absenceRequest = yield LeaveRequest_1.LeaveRequest.create({
                studentId,
                classId,
                startDate,
                endDate,
                reason,
                status: "PENDING", // Initial status
            });
            res.status(201).json({
                message: "Absence request submitted successfully.",
                absenceRequest,
            });
        }
        catch (error) {
            console.error("Error submitting absence request: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Review and update absence request status
function review_absence_request(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { absenceId } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        if (!["APPROVED", "DENIED"].includes(status)) {
            res.status(400).json({ message: "Invalid status value." });
            return;
        }
        try {
            const absenceRequest = yield LeaveRequest_1.LeaveRequest.findByPk(absenceId);
            if (!absenceRequest) {
                res.status(404).json({ message: "Absence request not found." });
                return;
            }
            yield absenceRequest.update({ status });
            res.status(200).json({
                message: "Absence request reviewed successfully.",
                absenceRequest,
            });
        }
        catch (error) {
            console.error("Error reviewing absence request: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get all absence requests for a specific class
function getAllAbsenceByClassId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.params;
        if (!classId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const absenceRequests = yield LeaveRequest_1.LeaveRequest.findAll({
                where: { classId },
            });
            res.status(200).json({ absenceRequests });
        }
        catch (error) {
            console.error("Error fetching absence requests: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function getAbsenceById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { absenceId } = req.params;
        if (!absenceId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const absenceRequests = yield LeaveRequest_1.LeaveRequest.findOne({
                where: { id: absenceId },
            });
            res.status(200).json({ absenceRequests });
        }
        catch (error) {
            console.error("Error fetching absence requests: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
