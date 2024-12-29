import { Router } from "express";
import {
  createClass,
  editClass,
  deleteClass,
  getClassInfo,
  getClassList,
  getClassSchedule,
} from "../controller/Class";
import { authenticate } from "../middleware/auth";

export const classRoutes = Router();

classRoutes.post("/create", authenticate, createClass);
classRoutes.put("/edit/:classId", authenticate, editClass);
classRoutes.delete("/delete/:classId", authenticate, deleteClass);
classRoutes.get("/info/:classId", authenticate, getClassInfo);
classRoutes.post("/list", authenticate, getClassList);
classRoutes.get("/schedule/:classId", authenticate, getClassSchedule);
