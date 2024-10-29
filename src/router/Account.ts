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

accountRoutes.put("/deactivate_user,", authenticate, deactivateUser);
accountRoutes.get("/get_user_classes,", authenticate, getUserClasses);
accountRoutes.get("/get_user_info,", authenticate, getUserInfo);
accountRoutes.put("/reactivate_user,", authenticate, reactivateUser);
accountRoutes.put("/set_user_info,", authenticate, setUserInfo);
accountRoutes.put("/set_user_role,", authenticate, setUserRole);
