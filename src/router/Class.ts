import { Router } from "express";
import { create_class } from "../controller/Class";
import { authenticate } from "../middleware/auth";

export const classRoutes = Router();

classRoutes.post("/create", create_class);
