import { Request, Response } from "express";
import { Survey } from "../database/models/Survey";
import { SurveyResponse } from "../database/models/SurveyResponse";

// Create a survey
async function create_survey(req: Request, res: Response) {
  const { title, description, questions } = req.body;

  if (!title || !questions) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const survey = await Survey.create({ title, description, questions });
    res.status(201).json({ message: "Survey created successfully.", survey });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Edit a survey
async function edit_survey(req: Request, res: Response) {
  const { surveyId, title, description, questions } = req.body;

  if (!surveyId) {
    res.status(400).json({ message: "Survey ID is required." });
    return;
  }

  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Survey not found." });
      return;
    }

    await survey.update({ title, description, questions });
    res.status(200).json({ message: "Survey updated successfully.", survey });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Delete a survey
async function delete_survey(req: Request, res: Response) {
  const { surveyId } = req.body;

  if (!surveyId) {
    res.status(400).json({ message: "Survey ID is required." });
    return;
  }

  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Survey not found." });
      return;
    }

    await survey.destroy();
    res.status(200).json({ message: "Survey deleted successfully." });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Submit a survey response
async function submit_survey(req: Request, res: Response) {
  const { surveyId, userId, answers } = req.body;

  if (!surveyId || !userId || !answers) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const response = await SurveyResponse.create({ surveyId, userId, answers });
    res
      .status(201)
      .json({ message: "Survey response submitted successfully.", response });
  } catch (error) {
    console.error("Error submitting survey response:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// Get survey responses
async function get_survey_responses(req: Request, res: Response) {
  const { surveyId } = req.body;

  if (!surveyId) {
    res.status(400).json({ message: "Survey ID is required." });
    return;
  }

  try {
    const responses = await SurveyResponse.findAll({
      where: { surveyId },
      include: [Survey], // Include Survey details if needed
    });

    res.status(200).json({ responses });
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export {
  create_survey,
  delete_survey,
  edit_survey,
  get_survey_responses,
  submit_survey,
};
