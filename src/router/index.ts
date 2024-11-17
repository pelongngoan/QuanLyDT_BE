import express, { Router } from "express";
import { authRoutes } from "./Auth";
import { classRoutes } from "./Class";
import { surveyRouter } from "./Survey";
import { accountRoutes } from "./Account";
import { assignmentRoutes } from "./Assignment";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/class", classRoutes);
router.use("/account", accountRoutes);
router.use("/assignment", assignmentRoutes);
router.use("/survey", surveyRouter);
