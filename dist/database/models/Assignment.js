"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Assignment extends sequelize_1.Model {
}
exports.Assignment = Assignment;
Assignment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    teacherId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Teacher",
            key: "id",
        },
    },
    classId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Class",
            key: "id",
        },
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    submittedBy: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
    },
    gradingStatus: {
        type: sequelize_1.DataTypes.ENUM("NOT_GRADED", "IN_PROGRESS", "GRADED"),
        allowNull: false,
        defaultValue: "NOT_GRADED",
    },
    score: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelizeConnection,
    tableName: "Assignment",
    timestamps: true,
    charset: "utf8",
});
