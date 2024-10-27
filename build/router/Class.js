"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRoutes = void 0;
const express_1 = require("express");
const Class_1 = require("../controller/Class");
const auth_1 = require("../middleware/auth");
exports.classRoutes = (0, express_1.Router)();
exports.classRoutes.post("/create", auth_1.authenticate, auth_1.isTeacher, Class_1.create_class);
exports.classRoutes.put("/edit", auth_1.authenticate, auth_1.isTeacher, Class_1.edit_class);
exports.classRoutes.delete("/delete", auth_1.authenticate, auth_1.isTeacher, Class_1.delete_class);
// Only apply authenticate for class info and schedule
exports.classRoutes.get("/info", auth_1.authenticate, Class_1.get_class_info);
exports.classRoutes.get("/list", auth_1.authenticate, auth_1.isTeacher, Class_1.get_class_list); // Only teachers can view class list
exports.classRoutes.get("/schedule", auth_1.authenticate, Class_1.get_class_schedule);
