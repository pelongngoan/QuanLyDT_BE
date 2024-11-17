import { Router } from "express";
import {
  create_survey,
  edit_survey,
  delete_survey,
  submit_survey,
  get_survey_responses,
} from "../controller/Survey";

export const surveyRouter = Router();

surveyRouter.post("/create_survey", create_survey);
surveyRouter.put("/edit_survey/:id", edit_survey);
surveyRouter.delete("/delete_survey/:id", delete_survey);
surveyRouter.post("/submit_survey", submit_survey);
surveyRouter.get("/get_survey_responses/:id", get_survey_responses);
