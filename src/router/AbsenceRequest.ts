import { Router } from "express";
import {
  getAbsenceById,
  getAllAbsenceByClassId,
  request_absence,
  review_absence_request,
} from "../controller/LeaveRequest";
import { authenticate } from "../middleware/auth";
export const absenceRequestRoutes = Router();

absenceRequestRoutes.post("/create", authenticate, request_absence);
absenceRequestRoutes.get(
  "/getAll/:classId",
  authenticate,
  getAllAbsenceByClassId
);
absenceRequestRoutes.get("/get/:absenceId", authenticate, getAbsenceById);
absenceRequestRoutes.put(
  "/update/:absenceId",
  authenticate,
  review_absence_request
);
