import { Router } from "express";
import {
  delete_material,
  edit_material,
  get_material_info,
  get_material_list,
  upload_material,
} from "../controller/Material";
import { authenticate } from "../middleware/auth";

export const materialRoutes = Router();

materialRoutes.delete("/delete/:materialId", authenticate, delete_material);
materialRoutes.put("/edit/:materialId", authenticate, edit_material);
materialRoutes.get("/get/:materialId", authenticate, get_material_info);
materialRoutes.get("/getList/:classId", authenticate, get_material_list);
materialRoutes.post("/upload", authenticate, upload_material);
