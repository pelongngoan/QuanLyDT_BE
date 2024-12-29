import { Router } from "express";
import { enRoll } from "../controller/Student";
import { authenticate } from "../middleware/auth";

export const studentRoutes = Router();

studentRoutes.post("/enroll", authenticate, enRoll);
