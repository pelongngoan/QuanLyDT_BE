"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_material = delete_material;
exports.edit_material = edit_material;
exports.get_material_info = get_material_info;
exports.get_material_list = get_material_list;
exports.upload_material = upload_material;
const Class_1 = require("../database/models/Class");
const Material_1 = require("../database/models/Material");
// Upload material
function upload_material(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId, title, description, fileUrl } = req.body;
        if (!classId || !title || !fileUrl) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            // Ensure class exists before associating material
            const classExists = yield Class_1.Class.findByPk(classId);
            if (!classExists) {
                res.status(404).json({ message: "Class not found." });
                return;
            }
            const material = yield Material_1.Material.create({
                classId,
                title,
                description,
                fileUrl,
            });
            res
                .status(201)
                .json({ message: "Material uploaded successfully.", material });
        }
        catch (error) {
            console.error("Error uploading material: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Edit material
function edit_material(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { materialId, title, description, fileUrl } = req.body;
        if (!materialId) {
            res.status(400).json({ message: "Material ID is required." });
            return;
        }
        try {
            const material = yield Material_1.Material.findByPk(materialId);
            if (!material) {
                res.status(404).json({ message: "Material not found." });
                return;
            }
            yield material.update({
                title: title || material.title,
                description: description || material.description,
                fileUrl: fileUrl || material.fileUrl,
            });
            res
                .status(200)
                .json({ message: "Material updated successfully.", material });
        }
        catch (error) {
            console.error("Error updating material: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Delete material
function delete_material(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { materialId } = req.body;
        if (!materialId) {
            res.status(400).json({ message: "Material ID is required." });
            return;
        }
        try {
            const material = yield Material_1.Material.findByPk(materialId);
            if (!material) {
                res.status(404).json({ message: "Material not found." });
                return;
            }
            yield material.destroy();
            res.status(200).json({ message: "Material deleted successfully." });
        }
        catch (error) {
            console.error("Error deleting material: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get material information
function get_material_info(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { materialId } = req.body;
        if (!materialId) {
            res.status(400).json({ message: "Material ID is required." });
            return;
        }
        try {
            const material = yield Material_1.Material.findByPk(materialId);
            if (!material) {
                res.status(404).json({ message: "Material not found." });
                return;
            }
            res.status(200).json({ material });
        }
        catch (error) {
            console.error("Error fetching material info: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get material list for a class
function get_material_list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { classId } = req.body;
        if (!classId) {
            res.status(400).json({ message: "Class ID is required." });
            return;
        }
        try {
            const materials = yield Material_1.Material.findAll({ where: { classId } });
            res.status(200).json({ materials });
        }
        catch (error) {
            console.error("Error fetching material list: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
