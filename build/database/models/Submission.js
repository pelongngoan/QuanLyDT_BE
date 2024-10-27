"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Submission extends sequelize_1.Model {
    static associate(models) {
        Submission.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
        Submission.belongsTo(models.Assignment, {
            foreignKey: "assignmentId",
            onDelete: "CASCADE",
        });
    }
}
exports.Submission = Submission;
exports.default = (sequelize) => {
    Submission.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        assignmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        fileUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Submission",
    });
    return Submission;
};
