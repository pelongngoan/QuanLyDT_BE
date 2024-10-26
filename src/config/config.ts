import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { NextFunction, Response, Router } from "express";
import { router } from "../router/index";
import { Account } from "../database/models/Account";
import { Teacher } from "../database/models/Teacher";
import { Class } from "../database/models/Class";
import { AbsenceRequest } from "../database/models/AbsenceRequest";
import { Assignment } from "../database/models/Assignment";
import { LeaveRequest } from "../database/models/LeaveRequest";
import { Material } from "../database/models/Material";
import { Notification } from "../database/models/Notification";
import { Student } from "../database/models/Student";
import { Submission } from "../database/models/Submission";
import { Survey } from "../database/models/Survey";
import { SurveyResponse } from "../database/models/SurveyResponse";

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
  await AbsenceRequest.sync({ alter: true });
  await Account.sync({ alter: true });
  await Assignment.sync({ alter: true });
  await Class.sync({ alter: true });
  await LeaveRequest.sync({ alter: true });
  await Material.sync({ alter: true });
  await Notification.sync({ alter: true });
  await Student.sync({ alter: true });
  await Submission.sync({ alter: true });
  await Survey.sync({ alter: true });
  await SurveyResponse.sync({ alter: true });
  await Teacher.sync({ alter: true });
}
