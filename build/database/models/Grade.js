"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
const sequelize_1 = require("sequelize");
const Student_1 = require("./Student");
const Assignment_1 = require("./Assignment");
const db_1 = require("../db");
class Grade extends sequelize_1.Model {
    static associate(models) {
        Grade.belongsTo(models.Assignment, {
            foreignKey: "assignmentId",
            onDelete: "CASCADE",
        });
        Grade.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
    }
}
exports.Grade = Grade;
exports.default = (sequelize) => {
    Grade.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assignmentId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Assignment_1.Assignment,
                key: "id",
            },
            allowNull: false,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Student_1.Student,
                key: "id",
            },
            allowNull: false,
        },
        grade: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: true },
        comments: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Grade",
    });
    return Grade;
};
