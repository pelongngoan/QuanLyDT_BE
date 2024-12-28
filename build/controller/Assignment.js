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
exports.submit_assignment = submit_assignment;
exports.create_assignment = create_assignment;
exports.delete_assignment = delete_assignment;
exports.edit_assignment = edit_assignment;
exports.grade_assignment = grade_assignment;
exports.get_assignment_info = get_assignment_info;
exports.get_assignment_list = get_assignment_list;
const Assignment_1 = require("../database/models/Assignment");
const Submission_1 = require("../database/models/Submission");
const enum_1 = require("../database/enum/enum");
const Grade_1 = require("../database/models/Grade");
const uuid_1 = require("uuid");
function create_assignment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { classId, title, description, dueDate } = req.body;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (userRole !== enum_1.ROLE.TEACHER) {
            res.status(403).json({
                message: "Access denied. Only teachers can create assignments.",
            });
            return;
        }
        try {
            const assignment = yield Assignment_1.Assignment.create({
                classId,
                title,
                description,
                dueDate,
                createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            });
            res
                .status(201)
                .json({ message: "Assignment created successfully!", assignment });
        }
        catch (error) {
            next(error);
        }
    });
}
function edit_assignment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { assignmentId } = req.params;
        const { title, description, dueDate } = req.body;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (userRole !== enum_1.ROLE.TEACHER) {
            res
                .status(403)
                .json({ message: "Access denied. Only teachers can edit assignments." });
            return;
        }
        try {
            const assignment = yield Assignment_1.Assignment.findOne({
                where: { id: assignmentId },
            });
            if (!assignment) {
                res.status(404).json({
                    message: "Assignment not found or you do not have permission to edit this assignment.",
                });
                return;
            }
            yield assignment.update({ title, description, dueDate });
            res
                .status(200)
                .json({ message: "Assignment updated successfully!", assignment });
        }
        catch (error) {
            next(error);
        }
    });
}
function delete_assignment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { assignmentId } = req.params;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (userRole !== enum_1.ROLE.TEACHER) {
            res.status(403).json({
                message: "Access denied. Only teachers can delete assignments.",
            });
            return;
        }
        try {
            const assignment = yield Assignment_1.Assignment.findOne({
                where: { id: assignmentId },
            });
            if (!assignment) {
                res.status(404).json({
                    message: "Assignment not found.",
                });
                return;
            }
            // Delete associated submissions
            yield Submission_1.Submission.destroy({
                where: { assignmentId },
            });
            // Delete associated grades
            yield Grade_1.Grade.destroy({
                where: { assignmentId },
            });
            // Delete the assignment
            yield assignment.destroy();
            res.status(200).json({
                message: "Assignment and its associations deleted successfully!",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function submit_assignment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { assignmentId } = req.params;
        const { fileUrl } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (userRole !== enum_1.ROLE.STUDENT) {
            res.status(403).json({
                message: "Access denied. Only students can submit assignments.",
            });
            return;
        }
        try {
            const submission = yield Submission_1.Submission.create({
                assignmentId,
                studentId: userId,
                fileUrl,
                submittedAt: new Date(),
            });
            res
                .status(201)
                .json({ message: "Assignment submitted successfully!", submission });
        }
        catch (error) {
            next(error);
        }
    });
}
function grade_assignment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { submissionId } = req.params;
        const { grade, comments } = req.body;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (userRole !== enum_1.ROLE.TEACHER) {
            res
                .status(403)
                .json({ message: "Access denied. Only teachers can grade assignments." });
            return;
        }
        try {
            const submission = yield Submission_1.Submission.findOne({
                where: { id: submissionId },
            });
            if (!submission) {
                res.status(404).json({ message: "Submission not found." });
                return;
            }
            const [gradeEntry, created] = yield Grade_1.Grade.findOrCreate({
                where: {
                    assignmentId: submission.assignmentId,
                    studentId: submission.studentId,
                },
                defaults: {
                    id: (0, uuid_1.v4)(),
                    grade,
                    assignmentId: submission.assignmentId,
                    studentId: submission.studentId,
                    comments,
                },
            });
            if (!created) {
                gradeEntry.grade = grade;
                gradeEntry.comments = comments;
                yield gradeEntry.save();
            }
            res.status(200).json({
                message: created
                    ? "Assignment graded successfully!"
                    : "Grade updated successfully!",
                grade: gradeEntry,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function get_assignment_info(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { assignmentId } = req.params;
        try {
            const assignment = yield Assignment_1.Assignment.findOne({
                where: { id: assignmentId },
            });
            if (!assignment) {
                res.status(404).json({ message: "Assignment not found." });
                return;
            }
            res
                .status(200)
                .json({ message: "Assignment retrieved successfully!", assignment });
        }
        catch (error) {
            next(error);
        }
    });
}
function get_assignment_list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.query;
        try {
            const assignments = yield Assignment_1.Assignment.findAll({
                where: { classId },
            });
            if (assignments.length === 0) {
                res.status(404).json({ message: "No assignments found for this class." });
                return;
            }
            res
                .status(200)
                .json({ message: "Assignments retrieved successfully!", assignments });
        }
        catch (error) {
            next(error);
        }
    });
}
