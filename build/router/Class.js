"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRoutes = void 0;
const express_1 = require("express");
const Class_1 = require("../controller/Class");
const auth_1 = require("../middleware/auth");
exports.classRoutes = (0, express_1.Router)();
exports.classRoutes.post("/create", auth_1.authenticate, Class_1.createClass);
exports.classRoutes.put("/edit/:classId", auth_1.authenticate, Class_1.editClass);
exports.classRoutes.delete("/delete/:classId", auth_1.authenticate, Class_1.deleteClass);
exports.classRoutes.get("/info/:classId", auth_1.authenticate, Class_1.getClassInfo);
exports.classRoutes.post("/list", auth_1.authenticate, Class_1.getClassList);
exports.classRoutes.get("/schedule/:classId", auth_1.authenticate, Class_1.getClassSchedule);
