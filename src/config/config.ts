import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { NextFunction, Response, Router } from "express";
import { router } from "../router/index";
import { Account } from "../database/models/Account";
import { Student } from "../database/models/Student";
import { Teacher } from "../database/models/Teacher";
import { Class } from "../database/models/Class";
import { Assignment } from "../database/models/Assignment";
import { ActivityLog } from "../database/models/ActivityLog";
import { Attendance } from "../database/models/Attendance";
import { LeaveRequest } from "../database/models/LeaveRequest";
import { Notification } from "../database/models/Notification";
import { StudyMaterial } from "../database/models/StudyMaterial";

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  exposedHeaders: "Authorization",
  credentials: true,
};

export async function config(app: Router) {
  await createDatabase();
  await app.use(cors(corsOptions));
  await app.use(bodyParser.json());
  await app.use(cookieParser());
  await app.use("/api", router);
}

async function createDatabase() {
  await Account.sync({ alter: true });
  // await Student.sync({ alter: true });
  await Teacher.sync({ alter: true });
  await Class.sync({ alter: true });
  // await Assignment.sync({ alter: true });
  // await ActivityLog.sync({ alter: true });
  // await Attendance.sync({ alter: true });
  // await LeaveRequest.sync({ alter: true });
  // await Notification.sync({ alter: true });
  // await StudyMaterial.sync({ alter: true });
}
