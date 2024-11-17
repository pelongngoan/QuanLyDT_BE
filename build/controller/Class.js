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
exports.createClass = createClass;
exports.editClass = editClass;
exports.deleteClass = deleteClass;
exports.getClassInfo = getClassInfo;
exports.getClassList = getClassList;
exports.getClassSchedule = getClassSchedule;
const Class_1 = require("../database/models/Class");
const uuid_1 = require("uuid");
function validateRole(req, res) {
    var _a;
    const allowedRoles = ["admin", "teacher"];
    if (!allowedRoles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
        res
            .status(403)
            .json({ message: "Access denied. Insufficient permissions." });
        return false;
    }
    return true;
}
function createClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        try {
            const { className, semester, maxStudents, startDate, endDate, teacherId } = req.body;
            if (!className ||
                !semester ||
                !maxStudents ||
                !startDate ||
                !endDate ||
                !teacherId) {
                res.status(400).json({ message: "All fields are required." });
                return;
            }
            const newClass = yield Class_1.Class.create({
                id: (0, uuid_1.v4)(),
                className,
                semester,
                maxStudents,
                startDate,
                endDate,
                teacherId,
            });
            res.status(201).json({
                message: "Class created successfully.",
                class: newClass,
            });
        }
        catch (error) {
            console.error("Error creating class:", error);
            res.status(500).json({ message: "Internal server error.", error });
        }
    });
}
function editClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        const { name, max_students, start_date, end_date } = req.body;
        if (!classId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const classToUpdate = yield Class_1.Class.findOne({
                where: { id: classId },
            });
            if (!classToUpdate) {
                res.status(404).json({
                    message: "Class not found or you do not have permission to edit this class.",
                });
                return;
            }
            yield classToUpdate.update({
                className: name || classToUpdate.className,
                maxStudents: max_students || classToUpdate.maxStudents,
                startDate: start_date || classToUpdate.startDate,
                endDate: end_date || classToUpdate.endDate,
            });
            res
                .status(200)
                .json({ message: "Class updated successfully!", class: classToUpdate });
        }
        catch (error) {
            console.error("Error editing class: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function deleteClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params; // Use params to get the classId from the URL
        if (!classId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const classToDelete = yield Class_1.Class.findOne({
                where: { id: classId },
            });
            if (!classToDelete) {
                res.status(404).json({
                    message: "Class not found or you do not have permission to delete this class.",
                });
                return;
            }
            yield classToDelete.destroy();
            res.status(200).json({ message: "Class deleted successfully!" });
        }
        catch (error) {
            console.error("Error deleting class: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function getClassInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params; // Use params to get the classId from the URL
        if (!classId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const classInfo = yield Class_1.Class.findOne({ where: { id: classId } });
            if (!classInfo) {
                res.status(404).json({ message: "Class not found." });
                return;
            }
            res.status(200).json({ class: classInfo });
        }
        catch (error) {
            console.error("Error fetching class info: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function getClassList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!validateRole(req, res))
            return;
        try {
            const classList = yield Class_1.Class.findAll({
                where: { teacherId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            });
            res.status(200).json({ classList });
        }
        catch (error) {
            console.error("Error fetching class list: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function getClassSchedule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        if (!classId) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            console.log(classId);
            const classSchedule = yield Class_1.Class.findOne({
                where: { id: classId },
                attributes: ["startDate", "endDate"],
            });
            if (!classSchedule) {
                res.status(404).json({ message: "Class schedule not found." });
                return;
            }
            res.status(200).json({ schedule: classSchedule });
        }
        catch (error) {
            console.error("Error fetching class schedule: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
