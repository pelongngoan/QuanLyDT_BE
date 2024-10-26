import { Request, Response } from "express";
import { AttendanceRecord } from "../database/models/Attendance";

async function take_attendance(req: Request, res: Response) {
  const { classId, studentId, status, date } = req.body;

  if (!classId || !studentId || !status || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceRecord = await AttendanceRecord.create({
      classId,
      studentId,
      status,
      date,
    });

    res.status(201).json({
      message: "Attendance recorded successfully!",
      attendance: attendanceRecord,
    });
  } catch (error) {
    console.error("Error recording attendance: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function get_attendance_record(req: Request, res: Response) {
  const { classId, studentId, date } = req.query;

  if (!classId || !studentId || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceRecord = await AttendanceRecord.findOne({
      where: { classId, studentId, date },
    });

    if (!attendanceRecord) {
      res.status(404).json({ message: "Attendance record not found." });
      return;
    }

    res.status(200).json({ attendance: attendanceRecord });
  } catch (error) {
    console.error("Error fetching attendance record: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function set_attendance_status(req: Request, res: Response) {
  const { classId, studentId, date, status } = req.body;

  if (!classId || !studentId || !date || !status) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceRecord = await AttendanceRecord.findOne({
      where: { classId, studentId, date },
    });

    if (!attendanceRecord) {
      res.status(404).json({ message: "Attendance record not found." });
      return;
    }

    attendanceRecord.status = status;
    await attendanceRecord.save();

    res.status(200).json({
      message: "Attendance status updated successfully!",
      attendance: attendanceRecord,
    });
  } catch (error) {
    console.error("Error updating attendance status: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function get_attendance_list(req: Request, res: Response) {
  const { classId, date } = req.query;

  if (!classId || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceList = await AttendanceRecord.findAll({
      where: { classId, date },
    });

    if (attendanceList.length === 0) {
      res
        .status(404)
        .json({ message: "No attendance records found for this date." });
      return;
    }

    res.status(200).json({ attendanceList });
  } catch (error) {
    console.error("Error fetching attendance list: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
