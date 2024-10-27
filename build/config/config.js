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
const Assignment_1 = require("../database/models/Assignment");
const LeaveRequest_1 = require("../database/models/LeaveRequest");
const Material_1 = require("../database/models/Material");
const Notification_1 = require("../database/models/Notification");
const Student_1 = require("../database/models/Student");
const Submission_1 = require("../database/models/Submission");
const Survey_1 = require("../database/models/Survey");
const SurveyResponse_1 = require("../database/models/SurveyResponse");
const ClassStudent_1 = require("../database/models/ClassStudent");
const Attendance_1 = require("../database/models/Attendance");
const Event_1 = require("../database/models/Event");
const Grade_1 = require("../database/models/Grade");
const Resource_1 = require("../database/models/Resource");
const Schedule_1 = require("../database/models/Schedule");
const Session_1 = require("../database/models/Session");
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    exposedHeaders: "Authorization",
    credentials: true,
};
function config(app) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createDatabase(); // Sync the models after connection is established
        yield app.use((0, cors_1.default)(corsOptions));
        yield app.use(body_parser_1.default.json());
        yield app.use((0, cookie_parser_1.default)());
        yield app.use("/api", index_1.router);
    });
}
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Syncing Account model");
            yield Account_1.Account.sync({ alter: true });
            yield Class_1.Class.sync({ alter: true });
            yield ClassStudent_1.ClassStudent.sync({ alter: true });
            yield Student_1.Student.sync({ alter: true });
            yield Teacher_1.Teacher.sync({ alter: true });
            yield Assignment_1.Assignment.sync({ alter: true });
            yield LeaveRequest_1.LeaveRequest.sync({ alter: true });
            yield Material_1.Material.sync({ alter: true });
            yield Notification_1.Notification.sync({ alter: true });
            yield Submission_1.Submission.sync({ alter: true });
            yield Survey_1.Survey.sync({ alter: true });
            yield Attendance_1.Attendance.sync({ alter: true });
            yield Event_1.Event.sync({ alter: true });
            yield Grade_1.Grade.sync({ alter: true });
            yield Resource_1.Resource.sync({ alter: true });
            yield Schedule_1.Schedule.sync({ alter: true });
            yield Session_1.Session.sync({ alter: true });
            yield Survey_1.Survey.sync({ alter: true });
            yield SurveyResponse_1.SurveyResponse.sync({ alter: true });
        }
        catch (error) {
            console.error("Database sync error:", error);
        }
    });
}
