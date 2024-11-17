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
exports.create_class = create_class;
exports.edit_class = edit_class;
exports.delete_class = delete_class;
exports.get_class_info = get_class_info;
exports.get_class_list = get_class_list;
exports.get_class_schedule = get_class_schedule;
const Class_1 = require("../database/models/Class");
const Teacher_1 = require("../database/models/Teacher");
function create_class(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, description, max_students, start_date, end_date, accountId } = req.body;
        if (!name || !max_students || !start_date || !end_date || !accountId) {
            res.status(1002).json({ message: "Missing required fields." });
            return;
        }
        try {
            // Find the teacher by the accountId from req.user
            const teacher = yield Teacher_1.Teacher.findOne({
                where: { accountId: accountId },
            });
            if (!teacher) {
                res.status(9994).json({ message: "Teacher not found." });
                return;
            }
            // Create the new class with the correct teacherId
            const newClass = yield Class_1.Class.create({
                teacherId: teacher.id, // Use teacher.id
                className: name,
                description: description,
                maxStudents: max_students,
                startDate: start_date,
                endDate: end_date,
            });
            res
                .status(1000)
                .json({ message: "Class created successfully!", class: newClass });
        }
        catch (error) {
            console.error("Error creating class: ", error);
            res.status(9999).json({ message: "Internal server error." });
        }
    });
}
function edit_class(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId, name, description, max_students, start_date, end_date, accountId, } = req.body;
        if (!classId) {
            res.status(1002).json({ message: "Missing required fields." });
            return;
        }
        try {
            const classToUpdate = yield Class_1.Class.findOne({
                where: { id: classId, teacherId: accountId },
            });
            if (!classToUpdate) {
                res.status(9994).json({
                    message: "Class not found or you do not have permission to edit this class.",
                });
                return;
            }
            // Update class fields
            yield classToUpdate.update({
                className: name || classToUpdate.className,
                maxStudents: max_students || classToUpdate.maxStudents,
                startDate: start_date || classToUpdate.startDate,
                endDate: end_date || classToUpdate.endDate,
            });
            res
                .status(1000)
                .json({ message: "Class updated successfully!", class: classToUpdate });
        }
        catch (error) {
            console.error("Error editing class: ", error);
            res.status(9999).json({ message: "Internal server error." });
        }
    });
}
function delete_class(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId, accountId } = req.body;
        if (!classId) {
            res.status(1002).json({ message: "Missing required fields." });
            return;
        }
        try {
            const classToDelete = yield Class_1.Class.findOne({
                where: { id: classId, teacherId: accountId },
            });
            if (!classToDelete) {
                res.status(9994).json({
                    message: "Class not found or you do not have permission to delete this class.",
                });
                return;
            }
            yield classToDelete.destroy();
            res.status(1000).json({ message: "Class deleted successfully!" });
        }
        catch (error) {
            console.error("Error deleting class: ", error);
            res.status(9999).json({ message: "Internal server error." });
        }
    });
}
function get_class_info(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.body;
        if (!classId) {
            res.status(1002).json({ message: "Missing required fields." });
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
function get_class_list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const classList = yield Class_1.Class.findAll({
                where: { teacherId: req.body.accountId },
            });
            res.status(200).json({ classList });
        }
        catch (error) {
            console.error("Error fetching class list: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
function get_class_schedule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.body;
        if (!classId) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
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
