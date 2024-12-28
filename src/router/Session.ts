import { Router } from "express";
import {
  createSession,
  getSession,
  getAllSessionByClassId,
} from "../controller/Session";
import { authenticate } from "../middleware/auth";

export const sessionRoutes = Router();

sessionRoutes.post("/create", authenticate, createSession);
sessionRoutes.get("/get/:sessionId", authenticate, getSession);
sessionRoutes.get("/getAll/:classId", authenticate, getAllSessionByClassId);
