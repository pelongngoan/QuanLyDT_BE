import { Router } from "express";
import {
  login,
  logout,
  signup,
  changeInfoAfterSignup,
  check_verify_code,
  get_verify_code,
  auth,
} from "../controller/Auth";
import { authenticate } from "../middleware/auth";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/logout", logout);
authRoutes.post("/get_verify_code", get_verify_code);
authRoutes.post("/check_verify_code", check_verify_code);
authRoutes.get("/me", authenticate, auth);
