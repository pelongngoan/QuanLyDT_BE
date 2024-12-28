import express, { Router } from "express";
import { authRoutes } from "./Auth";
import { classRoutes } from "./Class";
import { surveyRouter } from "./Survey";
import { accountRoutes } from "./Account";
import { assignmentRoutes } from "./Assignment";
import { attendanceRoutes } from "./Attendance";
import { sessionRoutes } from "./Session";
import { absenceRequestRoutes } from "./AbsenceRequest";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/class", classRoutes);
router.use("/account", accountRoutes);
router.use("/assignment", assignmentRoutes);
router.use("/survey", surveyRouter);
router.use("/attendance", attendanceRoutes);
router.use("/session", sessionRoutes);
router.use("/absence", absenceRequestRoutes);
