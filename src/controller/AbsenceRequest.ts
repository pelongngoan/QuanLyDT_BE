import { Request, Response } from "express";
import { AbsenceRequest } from "../database/models/AbsenceRequest.js";
import { Class } from "../database/models/Class.js";

async function request_absence(req: Request, res: Response) {
  const { userId, classId, date, reason } = req.body;

  if (!userId || !classId || !date || !reason) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const absenceRequest = await AbsenceRequest.create({
      userId,
      classId,
      date,
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
    const absenceRequest = await AbsenceRequest.findByPk(requestId);

    if (!absenceRequest) {
      res.status(404).json({ message: "Absence request not found." });
      return;
    }

    absenceRequest.update({ status });
    res.status(200).json({
      message: "Absence request reviewed successfully.",
      absenceRequest,
    });
  } catch (error) {
    console.error("Error reviewing absence request: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function get_absence_requests(req: Request, res: Response) {
  const { classId } = req.body;

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const absenceRequests = await AbsenceRequest.findAll({
      where: { classId },
    });

    res.status(200).json({ absenceRequests });
  } catch (error) {
    console.error("Error fetching absence requests: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export { get_absence_requests, request_absence, review_absence_request };
