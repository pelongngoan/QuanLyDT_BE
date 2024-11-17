import { Request, Response } from "express";
import { LeaveRequest } from "../database/models/LeaveRequest";
import { Student } from "../database/models/Student";
import { Class } from "../database/models/Class";

// Submit absence request
async function request_absence(req: Request, res: Response) {
  const { studentId, classId, startDate, endDate, reason } = req.body;

  if (!studentId || !classId || !startDate || !endDate || !reason) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const studentExists = await Student.findByPk(studentId);
    const classExists = await Class.findByPk(classId);

    if (!studentExists || !classExists) {
      res.status(404).json({ message: "Student or class not found." });
      return;
    }

    const absenceRequest = await LeaveRequest.create({
      studentId,
      classId,
      startDate,
      endDate,
      reason,
      status: "PENDING", // Initial status
    });

    res.status(201).json({
      message: "Absence request submitted successfully.",
      absenceRequest,
    });
  } catch (error) {
    console.error("Error submitting absence request: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Review and update absence request status
async function review_absence_request(req: Request, res: Response) {
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
    const absenceRequest = await LeaveRequest.findByPk(requestId);

    if (!absenceRequest) {
      res.status(404).json({ message: "Absence request not found." });
      return;
    }

    await absenceRequest.update({ status });
    res.status(200).json({
      message: "Absence request reviewed successfully.",
      absenceRequest,
    });
  } catch (error) {
    console.error("Error reviewing absence request: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Get all absence requests for a specific class
async function get_absence_requests(req: Request, res: Response) {
  const { classId } = req.query;

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const absenceRequests = await LeaveRequest.findAll({
      where: { classId },
    });

    res.status(200).json({ absenceRequests });
  } catch (error) {
    console.error("Error fetching absence requests: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { get_absence_requests, request_absence, review_absence_request };
