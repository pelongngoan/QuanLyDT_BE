import { Router } from "express";
import {
  get_attendance_list,
  get_attendance_record,
  set_attendance_status,
  take_attendance,
} from "../controller/Attendance";
import { authenticate } from "../middleware/auth";

export const assignmentRoutes = Router();

assignmentRoutes.get(
  "/get_attendance_list,",
  authenticate,
  get_attendance_list
);
assignmentRoutes.get(
  "/get_attendance_record,",
  authenticate,
  get_attendance_record
);
assignmentRoutes.put(
  "/set_attendance_status,",
  authenticate,
  set_attendance_status
);
assignmentRoutes.post("/take_attendance,", authenticate, take_attendance);
