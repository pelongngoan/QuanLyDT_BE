import { Router } from "express";
import {
  createSurvey,
  deleteSurvey,
  editSurvey,
  getSurveyResponses,
  submitSurvey,
} from "../controller/Survey";

export const surveyRouter = Router();

surveyRouter.post("/create", createSurvey);
surveyRouter.put("/edit/:id", editSurvey);
surveyRouter.delete("/delete/:id", deleteSurvey);
surveyRouter.post("/submit", submitSurvey);
surveyRouter.get("/getResponses/:id", getSurveyResponses);
