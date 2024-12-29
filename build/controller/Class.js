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
const Teacher_1 = require("../database/models/Teacher");
const enum_1 = require("../database/enum/enum");
const ClassStudent_1 = require("../database/models/ClassStudent");
function validateRole(req, res) {
    var _a;
    const allowedRoles = ["admin", "teacher"];
    if (!allowedRoles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
        res.status(403).json({ message: "Bạn không có quyền chỉnh sửa." });
        return false;
    }
    return true;
}
function createClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { className, semester, maxStudents, startDate, endDate, teacherId } = req.body;
        if (!className ||
            !semester ||
            !maxStudents ||
            !startDate ||
            !endDate ||
            !teacherId) {
            res.status(400).json({ message: "Thiếu tham số truyền vào." });
            return;
        }
        try {
            const teacherExist = yield Teacher_1.Teacher.findOne({ where: { id: teacherId } });
            if (!teacherExist) {
                res.status(400).json({ message: "Giáo viên không tồn tại" });
                return;
            }
            if (req.user.role === "teacher" && req.user.id !== teacherExist.accountId) {
                res
                    .status(400)
                    .json({ message: "Bạn không có quyền thêm hộ giáo viên khác." });
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
                message: "Tạo lớp thành công!",
                class: newClass,
            });
        }
        catch (error) {
            console.error("Error creating class:", error);
            res.status(500).json({ message: "Lỗi server.", error });
        }
    });
}
function editClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        const { className, semester, maxStudents, startDate, endDate, teacherId, status, } = req.body;
        if (!classId) {
            res.status(400).json({ message: "Thiếu tham số truyền vào" });
            return;
        }
        try {
            const classToUpdate = yield Class_1.Class.findOne({
                where: { id: classId },
            });
            if (!classToUpdate) {
                res.status(404).json({
                    message: "Không tìm thấy lớp học.",
                });
                return;
            }
            const teacherExist = yield Teacher_1.Teacher.findOne({ where: { id: teacherId } });
            if (!teacherExist) {
                res.status(400).json({ message: "Giáo viên không tồn tại" });
                return;
            }
            if (req.user.role === "teacher" && req.user.id !== teacherExist.accountId) {
                res
                    .status(400)
                    .json({ message: "Bạn không có quyền thêm hộ giáo viên khác." });
                return;
            }
            yield classToUpdate.update({
                className: className || classToUpdate.className,
                semester: semester || classToUpdate.semester,
                maxStudents: maxStudents || classToUpdate.maxStudents,
                startDate: startDate || classToUpdate.startDate,
                endDate: endDate || classToUpdate.endDate,
                teacherId: teacherId || classToUpdate.teacherId,
                status: status || classToUpdate.status,
            });
            res.status(200).json({
                message: "Cập nhật thông tin lớp thành công!",
                class: classToUpdate,
            });
        }
        catch (error) {
            console.error("Error editing class: ", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    });
}
function deleteClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        if (!classId) {
            res.status(400).json({ message: "Thiếu tham số truyền vào." });
            return;
        }
        try {
            const classToDelete = yield Class_1.Class.findOne({
                where: { id: classId },
            });
            if (!classToDelete) {
                res.status(404).json({
                    message: "Không tìm thấy lớp cần xóa.",
                });
                return;
            }
            yield classToDelete.destroy();
            res.status(200).json({ message: "Xóa lớp học thành công!" });
        }
        catch (error) {
            console.error("Error deleting class: ", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    });
}
function getClassInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        if (!classId) {
            res.status(400).json({ message: "Thiếu tham số truyền vào." });
            return;
        }
        try {
            const classInfo = yield Class_1.Class.findOne({ where: { id: classId } });
            if (!classInfo) {
                res.status(404).json({ message: "Lớp học không tồn tại." });
                return;
            }
            res.status(200).json({ class: classInfo });
        }
        catch (error) {
            console.error("Error fetching class info: ", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    });
}
// async function getClassList(req: Request, res: Response) {
//   if (!validateRole(req, res)) return;
//   try {
//     const classList = await Class.findAll({
//       where: { teacherId: req.user?.id },
//     });
//     res.status(200).json({ classList });
//   } catch (error) {
//     console.error("Error fetching class list: ", error);
//     res.status(500).json({ message: "Lỗi server." });
//   }
// }
function getClassList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, role } = req.body;
        try {
            if (role === enum_1.ROLE.STUDENT) {
                const classList = yield ClassStudent_1.ClassStudent.findAll({
                    where: { studentId: userId },
                });
                res.status(200).json({ classList });
            }
            if (role === enum_1.ROLE.TEACHER) {
                const classList = yield Class_1.Class.findAll({
                    where: { teacherId: userId },
                });
                res.status(200).json({ classList });
            }
            // res.status(200).json({ classList });
        }
        catch (error) {
            console.error("Error fetching class list: ", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    });
}
function getClassSchedule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validateRole(req, res))
            return;
        const { classId } = req.params;
        if (!classId) {
            res.status(400).json({ message: "Thiếu tham số truyền vào." });
            return;
        }
        try {
            const classSchedule = yield Class_1.Class.findOne({
                where: { id: classId },
                attributes: ["startDate", "endDate"],
            });
            if (!classSchedule) {
                res.status(404).json({ message: "Dữ liệu không tồn tại." });
                return;
            }
            res.status(200).json({ schedule: classSchedule });
        }
        catch (error) {
            console.error("Error fetching class schedule: ", error);
            res.status(500).json({ message: "Lỗi server." });
        }
    });
}
