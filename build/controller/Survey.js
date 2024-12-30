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
exports.createSurvey = createSurvey;
exports.deleteSurvey = deleteSurvey;
exports.editSurvey = editSurvey;
exports.getSurveyResponses = getSurveyResponses;
exports.submitSurvey = submitSurvey;
const Survey_1 = require("../database/models/Survey");
const SurveyResponse_1 = require("../database/models/SurveyResponse");
// Create a survey
function createSurvey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, classId } = req.body;
        if (!title || !classId) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const survey = yield Survey_1.Survey.create({ title, description, classId });
            res.status(201).json({ message: "Survey created successfully.", survey });
        }
        catch (error) {
            console.error("Error creating survey:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Edit a survey
function editSurvey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId } = req.params;
        const { title, description } = req.body;
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
            yield survey.update({ title, description });
            res.status(200).json({ message: "Survey updated successfully.", survey });
        }
        catch (error) {
            console.error("Error updating survey:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Delete a survey
function deleteSurvey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId } = req.params;
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
function submitSurvey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId, studentId, response } = req.body;
        if (!surveyId || !studentId || !response) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        try {
            const responses = yield SurveyResponse_1.SurveyResponse.create({
                surveyId,
                studentId,
                response,
            });
            res
                .status(201)
                .json({ message: "Survey response submitted successfully.", responses });
        }
        catch (error) {
            console.error("Error submitting survey response:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
// Get survey responses
function getSurveyResponses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyId } = req.params;
        if (!surveyId) {
            res.status(400).json({ message: "Survey ID is required." });
            return;
        }
        try {
            const responses = yield SurveyResponse_1.SurveyResponse.findAll({
                where: { surveyId: surveyId },
                // include: [Survey], // Include Survey details if needed
            });
            res.status(200).json({ responses });
        }
        catch (error) {
            console.error("Error fetching survey responses:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });
}
