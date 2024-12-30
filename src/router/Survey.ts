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
surveyRouter.put("/edit/:surveyId", editSurvey);
surveyRouter.delete("/delete/:surveyId", deleteSurvey);
surveyRouter.post("/submit", submitSurvey);
surveyRouter.get("/getResponses/:surveyId", getSurveyResponses);
