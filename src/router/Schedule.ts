import { Router } from "express";
import { createSchedule } from "../controller/Schedule";
import { authenticate } from "../middleware/auth";

export const scheduleRoutes = Router();

scheduleRoutes.post("/create", authenticate, createSchedule);
