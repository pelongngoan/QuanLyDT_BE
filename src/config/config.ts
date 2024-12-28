import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { Router } from "express";
import { router } from "../router/index";
import Teacher from "../database/models/Teacher";
import Class from "../database/models/Class";
import Assignment from "../database/models/Assignment";
import LeaveRequest from "../database/models/LeaveRequest";
import Material from "../database/models/Material";
import Notification from "../database/models/Notification";
import Student from "../database/models/Student";
import Submission from "../database/models/Submission";
import Survey from "../database/models/Survey";
import SurveyResponse from "../database/models/SurveyResponse";
import ClassStudent from "../database/models/ClassStudent";
import Attendance from "../database/models/Attendance";
import Event from "../database/models/Event";
import Grade from "../database/models/Grade";
import Resource from "../database/models/Resource";
import Schedule from "../database/models/Schedule";
import Session from "../database/models/Session";
import Account from "../database/models/Account";
import { sequelizeConnection } from "../database/db";
import Message from "../database/models/Message";

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  exposedHeaders: "Authorization",
  credentials: true,
};

export async function config(app: Router) {
  await createDatabase(); // Sync the models after connection is established
  await app.use(cors(corsOptions));
  await app.use(bodyParser.json());
  await app.use(cookieParser());
  await app.use("/api", router);
}

async function createDatabase() {
  try {
    Account(sequelizeConnection);
    Teacher(sequelizeConnection);
    Student(sequelizeConnection);
    Class(sequelizeConnection);
    ClassStudent(sequelizeConnection);
    Assignment(sequelizeConnection);
    LeaveRequest(sequelizeConnection);
    Material(sequelizeConnection);
    Message(sequelizeConnection);
    Notification(sequelizeConnection);
    Submission(sequelizeConnection);
    Session(sequelizeConnection);
    Attendance(sequelizeConnection);
    Event(sequelizeConnection);
    Grade(sequelizeConnection);
    Resource(sequelizeConnection);
    Schedule(sequelizeConnection);
    Survey(sequelizeConnection);
    SurveyResponse(sequelizeConnection);
    await sequelizeConnection.sync({ alter: true });
  } catch (error) {
    console.error("Database sync error:", error);
  }
}
