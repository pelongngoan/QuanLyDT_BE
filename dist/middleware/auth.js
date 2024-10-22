"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.isTeacher = isTeacher;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enum_1 = require("../database/enum/enum");
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        throw new Error("Access denied.");
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded; // Attach decoded token to the request
        next();
    });
}
function isTeacher(req, res, next) {
    const user = req.user;
    if (!user || user.role !== enum_1.ROLE.TEACHER) {
        throw new Error("Access denied. Only lecturers can perform this action.");
    }
    next(); // Continue to the next middleware or route handler
}
