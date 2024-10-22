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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = config;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("../router/index");
const Account_1 = require("../database/models/Account");
const Teacher_1 = require("../database/models/Teacher");
const Class_1 = require("../database/models/Class");
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    exposedHeaders: "Authorization",
    credentials: true,
};
function config(app) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createDatabase();
        yield app.use((0, cors_1.default)(corsOptions));
        yield app.use(body_parser_1.default.json());
        yield app.use((0, cookie_parser_1.default)());
        yield app.use("/api", index_1.router);
    });
}
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Account_1.Account.sync({ alter: true });
        // await Student.sync({ alter: true });
        yield Teacher_1.Teacher.sync({ alter: true });
        yield Class_1.Class.sync({ alter: true });
        // await Assignment.sync({ alter: true });
        // await ActivityLog.sync({ alter: true });
        // await Attendance.sync({ alter: true });
        // await LeaveRequest.sync({ alter: true });
        // await Notification.sync({ alter: true });
        // await StudyMaterial.sync({ alter: true });
    });
}
