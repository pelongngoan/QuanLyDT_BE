import express, { Router } from "express";
import { authRoutes } from "./Auth";
import { classRoutes } from "./Class";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/class", classRoutes);
