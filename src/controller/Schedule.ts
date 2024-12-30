import { Request, Response } from "express";

import { Class } from "../database/models/Class";
import { Schedule } from "../database/models/Schedule";

async function createSchedule(req: Request, res: Response) {
  const { classId, dayOfWeek, startTime, endTime, location } = req.body;

  if (!classId || !dayOfWeek || !startTime || !endTime || !location) {
    res.status(400).json({ message: "Thiếu tham số truyền vào." });
    return;
  }
  try {
    const classExist = await Class.findOne({ where: { id: classId } });
    if (!classExist) {
      res.status(400).json({ message: "Lớp học không tồn tại" });
      return;
    }
    await Schedule.create({
      classId,
      dayOfWeek,
      startTime,
      endTime,
      location,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Lỗi server.", error });
  }
}

export { createSchedule };
