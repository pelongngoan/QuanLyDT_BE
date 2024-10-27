import { Router } from "express";
import {
  delete_material,
  edit_material,
  get_material_info,
  get_material_list,
  upload_material,
} from "../controller/Material";
import { authenticate } from "../middleware/auth";

export const accountRoutes = Router();

accountRoutes.delete("/delete_material", authenticate, delete_material);
accountRoutes.put("/edit_material", authenticate, edit_material);
accountRoutes.get("/get_material_inf", authenticate, get_material_info);
accountRoutes.get("/get_material_list", authenticate, get_material_list);
accountRoutes.post("/upload_material", authenticate, upload_material);
