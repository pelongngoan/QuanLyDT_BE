import { Request, Response } from "express";
import { Class } from "../database/models/Class";
import { Material } from "../database/models/Material";

async function upload_material(req: Request, res: Response) {
  const { classId, title, description, fileUrl } = req.body;

  if (!classId || !title || !fileUrl) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const material = await Material.create({
      classId,
      title,
      description,
      fileUrl,
    });

    res
      .status(201)
      .json({ message: "Material uploaded successfully.", material });
  } catch (error) {
    console.error("Error uploading material: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function edit_material(req: Request, res: Response) {
  const { materialId, title, description, fileUrl } = req.body;

  if (!materialId) {
    res.status(400).json({ message: "Material ID is required." });
    return;
  }

  try {
    const material = await Material.findByPk(materialId);

    if (!material) {
      res.status(404).json({ message: "Material not found." });
      return;
    }

    await material.update({
      title: title || material.title,
      description: description || material.description,
      fileUrl: fileUrl || material.fileUrl,
    });

    res
      .status(200)
      .json({ message: "Material updated successfully.", material });
  } catch (error) {
    console.error("Error updating material: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function delete_material(req: Request, res: Response) {
  const { materialId } = req.body;

  if (!materialId) {
    res.status(400).json({ message: "Material ID is required." });
    return;
  }

  try {
    const material = await Material.findByPk(materialId);

    if (!material) {
      res.status(404).json({ message: "Material not found." });
      return;
    }

    await material.destroy();
    res.status(200).json({ message: "Material deleted successfully." });
  } catch (error) {
    console.error("Error deleting material: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function get_material_info(req: Request, res: Response) {
  const { materialId } = req.body;

  if (!materialId) {
    res.status(400).json({ message: "Material ID is required." });
    return;
  }

  try {
    const material = await Material.findByPk(materialId);

    if (!material) {
      res.status(404).json({ message: "Material not found." });
      return;
    }

    res.status(200).json({ material });
  } catch (error) {
    console.error("Error fetching material info: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function get_material_list(req: Request, res: Response) {
  const { classId } = req.body;

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const materials = await Material.findAll({ where: { classId } });
    res.status(200).json({ materials });
  } catch (error) {
    console.error("Error fetching material list: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export {
  delete_material,
  edit_material,
  get_material_info,
  get_material_list,
  upload_material,
};
