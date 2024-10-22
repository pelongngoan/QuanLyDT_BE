import { Router } from "express";
import {
  create_class,
  delete_class,
  edit_class,
  get_class_info,
  get_class_list,
  get_class_schedule,
} from "../controller/Class";
import { isTeacher, authenticate } from "../middleware/auth";

export const classRoutes = Router();

classRoutes.post("/create", authenticate, isTeacher, create_class);
classRoutes.put("/edit", authenticate, isTeacher, edit_class);
classRoutes.delete("/delete", authenticate, isTeacher, delete_class);

// Only apply authenticate for class info and schedule
classRoutes.get("/info", authenticate, get_class_info);
classRoutes.get("/list", authenticate, isTeacher, get_class_list); // Only teachers can view class list
classRoutes.get("/schedule", authenticate, get_class_schedule);
