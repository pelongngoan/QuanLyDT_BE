import { Router } from "express";
import {
  login,
  logout,
  signup,
  changeInfoAfterSignup,
  checkVerifyCode,
  getVerifyCode,
} from "../controller/Auth";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/logout", logout);
authRoutes.post("/get_verify_code", getVerifyCode);
authRoutes.post("/check_verify_code", checkVerifyCode);
authRoutes.put("/change_info_after_signup", changeInfoAfterSignup);
