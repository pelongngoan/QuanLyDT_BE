import express, { Router } from "express";
import { authRoutes } from "./Auth";
import { classRoutes } from "./Class";
import { surveyRouter } from "./Survey";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/class", classRoutes);
router.use("/survey", surveyRouter);
