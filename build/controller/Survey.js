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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_survey = create_survey;
exports.delete_survey = delete_survey;
exports.edit_survey = edit_survey;
exports.get_survey_responses = get_survey_responses;
exports.submit_survey = submit_survey;
const Survey_1 = require("../database/models/Survey");
const SurveyResponse_1 = require("../database/models/SurveyResponse");
// Create a survey
function create_survey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, questions } = req.body;
        if (!title || !questions) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const survey = yield Survey_1.Survey.create({ title, description, questions });
            res.status(201).json({ message: "Survey created successfully.", survey });
        }
        catch (error) {
            console.error("Error creating survey:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Edit a survey
function edit_survey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId, title, description, questions } = req.body;
        if (!surveyId) {
            res.status(400).json({ message: "Survey ID is required." });
            return;
        }
        try {
            const survey = yield Survey_1.Survey.findByPk(surveyId);
            if (!survey) {
                res.status(404).json({ message: "Survey not found." });
                return;
            }
            yield survey.update({ title, description, questions });
            res.status(200).json({ message: "Survey updated successfully.", survey });
        }
        catch (error) {
            console.error("Error updating survey:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Delete a survey
function delete_survey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId } = req.body;
        if (!surveyId) {
            res.status(400).json({ message: "Survey ID is required." });
            return;
        }
        try {
            const survey = yield Survey_1.Survey.findByPk(surveyId);
            if (!survey) {
                res.status(404).json({ message: "Survey not found." });
                return;
            }
            yield survey.destroy();
            res.status(200).json({ message: "Survey deleted successfully." });
        }
        catch (error) {
            console.error("Error deleting survey:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Submit a survey response
function submit_survey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId, userId, answers } = req.body;
        if (!surveyId || !userId || !answers) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const response = yield SurveyResponse_1.SurveyResponse.create({ surveyId, userId, answers });
            res
                .status(201)
                .json({ message: "Survey response submitted successfully.", response });
        }
        catch (error) {
            console.error("Error submitting survey response:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get survey responses
function get_survey_responses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId } = req.body;
        if (!surveyId) {
            res.status(400).json({ message: "Survey ID is required." });
            return;
        }
        try {
            const responses = yield SurveyResponse_1.SurveyResponse.findAll({
                where: { surveyId },
                include: [Survey_1.Survey], // Include Survey details if needed
            });
            res.status(200).json({ responses });
        }
        catch (error) {
            console.error("Error fetching survey responses:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
