"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentRoutes = void 0;
const express_1 = require("express");
const Assignment_1 = require("../controller/Assignment");
const auth_1 = require("../middleware/auth");
exports.assignmentRoutes = (0, express_1.Router)();
exports.assignmentRoutes.post("/create", auth_1.authenticate, Assignment_1.create_assignment);
exports.assignmentRoutes.put("/edit/:assignmentId", auth_1.authenticate, Assignment_1.edit_assignment);
exports.assignmentRoutes.delete("/delete/:assignmentId", auth_1.authenticate, Assignment_1.delete_assignment);
exports.assignmentRoutes.post("/submit/:assignmentId", auth_1.authenticate, Assignment_1.submit_assignment);
exports.assignmentRoutes.put("/grade/:submissionId", auth_1.authenticate, Assignment_1.grade_assignment);
exports.assignmentRoutes.get("/info/:assignmentId", auth_1.authenticate, Assignment_1.get_assignment_info);
exports.assignmentRoutes.get("/list", auth_1.authenticate, Assignment_1.get_assignment_list);
