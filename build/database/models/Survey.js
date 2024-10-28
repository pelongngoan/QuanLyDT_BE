"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const sequelize_1 = require("sequelize");
class Survey extends sequelize_1.Model {
    static associate(models) {
        Survey.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
        Survey.hasMany(models.SurveyResponse, {
            foreignKey: "surveyId",
            onDelete: "CASCADE",
        });
    }
}
exports.Survey = Survey;
exports.default = (sequelize) => {
    Survey.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Survey",
    });
    return Survey;
};
