import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { NextFunction, Response, Router } from "express";
import { router } from "../router/index";
import { Account } from "../database/models/Account";
import { Teacher } from "../database/models/Teacher";
import { Class } from "../database/models/Class";
import { Assignment } from "../database/models/Assignment";
import { LeaveRequest } from "../database/models/LeaveRequest";
import { Material } from "../database/models/Material";
import { Notification } from "../database/models/Notification";
import { Student } from "../database/models/Student";
import { Submission } from "../database/models/Submission";
import { Survey } from "../database/models/Survey";
import { SurveyResponse } from "../database/models/SurveyResponse";
import { ClassStudent } from "../database/models/ClassStudent";
import { Attendance } from "../database/models/Attendance";
import { Event } from "../database/models/Event";
import { Grade } from "../database/models/Grade";
import { Resource } from "../database/models/Resource";
import { Schedule } from "../database/models/Schedule";
import { Session } from "../database/models/Session";

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
    console.log("Syncing Account model");
    await Account.sync({ alter: true });
    await Class.sync({ alter: true });
    await ClassStudent.sync({ alter: true });
    await Student.sync({ alter: true });
    await Teacher.sync({ alter: true });
    await Assignment.sync({ alter: true });
    await LeaveRequest.sync({ alter: true });
    await Material.sync({ alter: true });
    await Notification.sync({ alter: true });
    await Submission.sync({ alter: true });
    await Survey.sync({ alter: true });
    await Attendance.sync({ alter: true });
    await Event.sync({ alter: true });
    await Grade.sync({ alter: true });
    await Resource.sync({ alter: true });
    await Schedule.sync({ alter: true });
    await Session.sync({ alter: true });
    await Survey.sync({ alter: true });
    await SurveyResponse.sync({ alter: true });
  } catch (error) {
    console.error("Database sync error:", error);
  }
}
