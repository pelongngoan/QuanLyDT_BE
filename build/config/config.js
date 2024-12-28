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
const Teacher_1 = __importDefault(require("../database/models/Teacher"));
const Class_1 = __importDefault(require("../database/models/Class"));
const Assignment_1 = __importDefault(require("../database/models/Assignment"));
const LeaveRequest_1 = __importDefault(require("../database/models/LeaveRequest"));
const Material_1 = __importDefault(require("../database/models/Material"));
const Notification_1 = __importDefault(require("../database/models/Notification"));
const Student_1 = __importDefault(require("../database/models/Student"));
const Submission_1 = __importDefault(require("../database/models/Submission"));
const Survey_1 = __importDefault(require("../database/models/Survey"));
const SurveyResponse_1 = __importDefault(require("../database/models/SurveyResponse"));
const ClassStudent_1 = __importDefault(require("../database/models/ClassStudent"));
const Attendance_1 = __importDefault(require("../database/models/Attendance"));
const Event_1 = __importDefault(require("../database/models/Event"));
const Grade_1 = __importDefault(require("../database/models/Grade"));
const Resource_1 = __importDefault(require("../database/models/Resource"));
const Schedule_1 = __importDefault(require("../database/models/Schedule"));
const Session_1 = __importDefault(require("../database/models/Session"));
const Account_1 = __importDefault(require("../database/models/Account"));
const db_1 = require("../database/db");
const Message_1 = __importDefault(require("../database/models/Message"));
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
            (0, Account_1.default)(db_1.sequelizeConnection);
            (0, Teacher_1.default)(db_1.sequelizeConnection);
            (0, Student_1.default)(db_1.sequelizeConnection);
            (0, Class_1.default)(db_1.sequelizeConnection);
            (0, ClassStudent_1.default)(db_1.sequelizeConnection);
            (0, Assignment_1.default)(db_1.sequelizeConnection);
            (0, LeaveRequest_1.default)(db_1.sequelizeConnection);
            (0, Material_1.default)(db_1.sequelizeConnection);
            (0, Message_1.default)(db_1.sequelizeConnection);
            (0, Notification_1.default)(db_1.sequelizeConnection);
            (0, Submission_1.default)(db_1.sequelizeConnection);
            (0, Session_1.default)(db_1.sequelizeConnection);
            (0, Attendance_1.default)(db_1.sequelizeConnection);
            (0, Event_1.default)(db_1.sequelizeConnection);
            (0, Grade_1.default)(db_1.sequelizeConnection);
            (0, Resource_1.default)(db_1.sequelizeConnection);
            (0, Schedule_1.default)(db_1.sequelizeConnection);
            (0, Survey_1.default)(db_1.sequelizeConnection);
            (0, SurveyResponse_1.default)(db_1.sequelizeConnection);
            yield db_1.sequelizeConnection.sync({ alter: true });
        }
        catch (error) {
            console.error("Database sync error:", error);
        }
    });
}
