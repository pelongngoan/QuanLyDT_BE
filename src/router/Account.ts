import { Router } from "express";
import {
  deactivate_user,
  get_user_classes,
  get_user_info,
  reactivate_user,
  set_user_info,
  set_user_role,
} from "../controller/Account";
import { authenticate } from "../middleware/auth";

export const accountRoutes = Router();

accountRoutes.put("/deactivate_user,", authenticate, deactivate_user);
accountRoutes.get("/get_user_classes,", authenticate, get_user_classes);
accountRoutes.get("/get_user_info,", authenticate, get_user_info);
accountRoutes.put("/reactivate_user,", authenticate, reactivate_user);
accountRoutes.put("/set_user_info,", authenticate, set_user_info);
accountRoutes.put("/set_user_role,", authenticate, set_user_role);
