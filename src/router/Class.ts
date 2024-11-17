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
classRoutes.put("/edit/:id", authenticate, isTeacher, edit_class);
classRoutes.delete("/delete/:id", authenticate, isTeacher, delete_class);
classRoutes.get("/info/:id", authenticate, get_class_info);
classRoutes.get("/list/:id", authenticate, isTeacher, get_class_list); // Only teachers can view class list
classRoutes.get("/schedule/:id", authenticate, get_class_schedule);
