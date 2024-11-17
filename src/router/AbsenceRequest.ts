import { Router } from "express";
import {
  request_absence,
  get_absence_requests,
  review_absence_request,
} from "../controller/LeaveRequest";
import { authenticate } from "../middleware/auth";

export const absenceRequestRoutes = Router();

absenceRequestRoutes.post("/request_absence", authenticate, request_absence);
absenceRequestRoutes.post(
  "/review_absence_request",
  authenticate,
  review_absence_request
);
absenceRequestRoutes.get(
  "/get_absence_requests/:id",
  authenticate,
  get_absence_requests
);
