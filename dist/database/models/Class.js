"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Class extends sequelize_1.Model {
}
exports.Class = Class;
Class.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    teacherId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: "Teacher",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    studentList: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    assignments: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    schedule: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    maxStudents: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
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
    tableName: "Class",
    timestamps: true,
    charset: "utf8",
});
