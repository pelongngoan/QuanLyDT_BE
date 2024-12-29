import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Student } from "../database/models/Student";
import { ClassStudent } from "../database/models/ClassStudent";

async function enRoll(req: Request, res: Response) {
  const { studentId, classId, enrollmentDate } = req.body;

  if (!studentId || !classId || !enrollmentDate) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }
  try {
    const studentExist = await Student.findOne({ where: { id: studentId } });
    if (!studentExist) {
      res.status(400).json({ message: "Sinh viên không tồn tại" });
      return;
    }

    const newClass = await ClassStudent.create({
      id: uuidv4(),
      classId,
      studentId,
      enrollmentDate,
    });

    res.status(201).json({
      message: "Đăng kí lớp thành công!",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
}

export { enRoll };
