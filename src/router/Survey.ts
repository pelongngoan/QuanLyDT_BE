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
surveyRouter.put("/edit_survey", edit_survey);
surveyRouter.delete("/delete_survey", delete_survey);
surveyRouter.post("/submit_survey", submit_survey);
surveyRouter.get("/get_survey_responses", get_survey_responses);
