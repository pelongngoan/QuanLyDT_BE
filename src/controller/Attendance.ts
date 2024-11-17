import { Request, Response } from "express";
import { Attendance } from "../database/models/Attendance";
import { Session } from "../database/models/Session";
import { Student } from "../database/models/Student";

// Record attendance
async function take_attendance(req: Request, res: Response) {
  const { sessionId, studentId, status, date } = req.body;

  if (!sessionId || !studentId || !status || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    // Ensure the session and student exist
    const sessionExists = await Session.findByPk(sessionId);
    const studentExists = await Student.findByPk(studentId);
    if (!sessionExists || !studentExists) {
      res.status(404).json({ message: "Session or student not found." });
      return;
    }

    const attendanceRecord = await Attendance.create({
      sessionId,
      studentId,
      isPresent: status.toLowerCase() === "present",
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

// Retrieve a specific attendance record
async function get_attendance_record(req: Request, res: Response) {
  const { sessionId, studentId, date } = req.query;

  if (!sessionId || !studentId || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceRecord = await Attendance.findOne({
      where: { sessionId, studentId, date },
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

// Update attendance status
async function set_attendance_status(req: Request, res: Response) {
  const { sessionId, studentId, date, status } = req.body;

  if (!sessionId || !studentId || !date || !status) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceRecord = await Attendance.findOne({
      where: { sessionId, studentId, date },
    });

    if (!attendanceRecord) {
      res.status(404).json({ message: "Attendance record not found." });
      return;
    }

    attendanceRecord.isPresent = status.toLowerCase() === "present";
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

// Get all attendance records for a specific session and date
async function get_attendance_list(req: Request, res: Response) {
  const { sessionId, date } = req.query;

  if (!sessionId || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const attendanceList = await Attendance.findAll({
      where: { sessionId, date },
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

export {
  get_attendance_list,
  get_attendance_record,
  set_attendance_status,
  take_attendance,
};
