import { Router } from "express";
import {
  get_attendance_list,
  get_attendance_record,
  set_attendance_status,
  take_attendance,
} from "../controller/Attendance";
import { authenticate } from "../middleware/auth";

export const attendanceRoutes = Router();

attendanceRoutes.get(
  "/get_attendance_list/:sessionId",
  authenticate,
  get_attendance_list
);
attendanceRoutes.get(
  "/get_attendance_record/:attendanceId",
  authenticate,
  get_attendance_record
);
attendanceRoutes.put(
  "/set_attendance_status/:attendanceId",
  authenticate,
  set_attendance_status
);
attendanceRoutes.post("/take_attendance", authenticate, take_attendance);
