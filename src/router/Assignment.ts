import { Router } from "express";
import {
  submit_assignment,
  create_assignment,
  delete_assignment,
  edit_assignment,
  grade_assignment,
} from "../controller/Assignment";
import { authenticate } from "../middleware/auth";

export const assignmentRoutes = Router();

assignmentRoutes.post("/submit_assignment,,", authenticate, submit_assignment);
assignmentRoutes.post("/create_assignment,,", authenticate, create_assignment);
assignmentRoutes.delete(
  "/delete_assignment,,",
  authenticate,
  delete_assignment
);
assignmentRoutes.post("/edit_assignment,,", authenticate, edit_assignment);
assignmentRoutes.post("/grade_assignment,,", authenticate, grade_assignment);
