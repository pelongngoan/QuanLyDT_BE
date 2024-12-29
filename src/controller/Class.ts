import { Request, Response } from "express";
import { Class } from "../database/models/Class";
import { v4 as uuidv4 } from "uuid";
import { Teacher } from "../database/models/Teacher";
import { ROLE } from "../database/enum/enum";
import { ClassStudent } from "../database/models/ClassStudent";

function validateRole(req: Request, res: Response): boolean {
  const allowedRoles = ["admin", "teacher"];
  if (!allowedRoles.includes(req.user?.role)) {
    res.status(403).json({ message: "Bạn không có quyền chỉnh sửa." });
    return false;
  }
  return true;
}

async function createClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { className, semester, maxStudents, startDate, endDate, teacherId } =
    req.body;

  if (
    !className ||
    !semester ||
    !maxStudents ||
    !startDate ||
    !endDate ||
    !teacherId
  ) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }
  try {
    const teacherExist = await Teacher.findOne({ where: { id: teacherId } });
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
    const newClass = await Class.create({
      id: uuidv4(),
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
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
}

async function editClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;
  const {
    className,
    semester,
    maxStudents,
    startDate,
    endDate,
    teacherId,
    status,
  } = req.body;

  if (!classId) {
    res.status(400).json({ message: "Thiếu tham số truyền vào" });
    return;
  }

  try {
    const classToUpdate = await Class.findOne({
      where: { id: classId },
    });

    if (!classToUpdate) {
      res.status(404).json({
        message: "Không tìm thấy lớp học.",
      });
      return;
    }
    const teacherExist = await Teacher.findOne({ where: { id: teacherId } });
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

    await classToUpdate.update({
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
  } catch (error) {
    console.error("Error editing class: ", error);
    res.status(500).json({ message: "Lỗi server." });
  }
}

async function deleteClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;

  if (!classId) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }

  try {
    const classToDelete = await Class.findOne({
      where: { id: classId },
    });

    if (!classToDelete) {
      res.status(404).json({
        message: "Không tìm thấy lớp cần xóa.",
      });
      return;
    }

    await classToDelete.destroy();
    res.status(200).json({ message: "Xóa lớp học thành công!" });
  } catch (error) {
    console.error("Error deleting class: ", error);
    res.status(500).json({ message: "Lỗi server." });
  }
}

async function getClassInfo(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;

  if (!classId) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }

  try {
    const classInfo = await Class.findOne({ where: { id: classId } });

    if (!classInfo) {
      res.status(404).json({ message: "Lớp học không tồn tại." });
      return;
    }

    res.status(200).json({ class: classInfo });
  } catch (error) {
    console.error("Error fetching class info: ", error);
    res.status(500).json({ message: "Lỗi server." });
  }
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
async function getClassList(req: Request, res: Response) {
  const { userId, role } = req.body;

  try {
    if (role === ROLE.STUDENT) {
      const classList = await ClassStudent.findAll({
        where: { studentId: userId },
      });
      res.status(200).json({ classList });
    }
    if (role === ROLE.TEACHER) {
      const classList = await Class.findAll({
        where: { teacherId: userId },
      });
      res.status(200).json({ classList });
    }
    // res.status(200).json({ classList });
  } catch (error) {
    console.error("Error fetching class list: ", error);
    res.status(500).json({ message: "Lỗi server." });
  }
}

async function getClassSchedule(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;

  if (!classId) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }

  try {
    const classSchedule = await Class.findOne({
      where: { id: classId },
      attributes: ["startDate", "endDate"],
    });

    if (!classSchedule) {
      res.status(404).json({ message: "Dữ liệu không tồn tại." });
      return;
    }

    res.status(200).json({ schedule: classSchedule });
  } catch (error) {
    console.error("Error fetching class schedule: ", error);
    res.status(500).json({ message: "Lỗi server." });
  }
}

export {
  createClass,
  editClass,
  deleteClass,
  getClassInfo,
  getClassList,
  getClassSchedule,
};
