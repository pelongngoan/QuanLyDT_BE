import { Router } from "express";
import {
  submit_assignment,
  create_assignment,
  delete_assignment,
  edit_assignment,
  grade_assignment,
  get_assignment_info,
  get_assignment_list,
} from "../controller/Assignment";
import { authenticate } from "../middleware/auth";

export const assignmentRoutes = Router();

assignmentRoutes.post("/create", authenticate, create_assignment);
assignmentRoutes.put("/edit/:assignmentId", authenticate, edit_assignment);
assignmentRoutes.delete(
  "/delete/:assignmentId",
  authenticate,
  delete_assignment
);
assignmentRoutes.post("/submit/:assignmentId", authenticate, submit_assignment);
assignmentRoutes.put("/grade/:submissionId", authenticate, grade_assignment);
assignmentRoutes.get("/info/:assignmentId", authenticate, get_assignment_info);
assignmentRoutes.get("/list", authenticate, get_assignment_list);
