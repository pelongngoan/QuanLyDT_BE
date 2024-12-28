import { Router } from "express";
import {
  deactivateUser,
  getUserClasses,
  getUserInfo,
  reactivateUser,
  setUserInfo,
  setUserRole,
} from "../controller/Account";
import { authenticate } from "../middleware/auth";

export const accountRoutes = Router();

accountRoutes.get("/get_user_classes/:id", authenticate, getUserClasses);
accountRoutes.get("/get_user_info/:id", authenticate, getUserInfo);
accountRoutes.put("/deactivate_user", authenticate, deactivateUser);
accountRoutes.put("/reactivate_user", authenticate, reactivateUser);
accountRoutes.put("/set_user_info", authenticate, setUserInfo);
accountRoutes.put("/set_user_role", authenticate, setUserRole);
