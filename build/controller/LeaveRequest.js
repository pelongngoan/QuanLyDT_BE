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
exports.get_absence_requests = get_absence_requests;
exports.request_absence = request_absence;
exports.review_absence_request = review_absence_request;
const LeaveRequest_1 = require("../database/models/LeaveRequest");
function request_absence(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, classId, date, reason } = req.body;
        if (!userId || !classId || !date || !reason) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const absenceRequest = yield LeaveRequest_1.LeaveRequest.create({
                userId,
                classId,
                date,
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
function review_absence_request(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { requestId, status } = req.body;
        if (!requestId || !status) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        if (!["APPROVED", "DENIED"].includes(status)) {
            res.status(400).json({ message: "Invalid status value." });
            return;
        }
        try {
            const absenceRequest = yield LeaveRequest_1.LeaveRequest.findByPk(requestId);
            if (!absenceRequest) {
                res.status(404).json({ message: "Absence request not found." });
                return;
            }
            absenceRequest.update({ status });
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
function get_absence_requests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.body;
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
