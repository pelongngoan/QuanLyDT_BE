"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyResponse = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class SurveyResponse extends sequelize_1.Model {
    static associate(models) {
        SurveyResponse.belongsTo(models.Survey, {
            foreignKey: "surveyId",
            onDelete: "CASCADE",
        });
        SurveyResponse.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
    }
}
exports.SurveyResponse = SurveyResponse;
exports.default = (sequelize) => {
    SurveyResponse.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        surveyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        response: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "SurveyResponse",
    });
    return SurveyResponse;
};
