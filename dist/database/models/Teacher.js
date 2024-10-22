"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Teacher extends sequelize_1.Model {
}
exports.Teacher = Teacher;
Teacher.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    accountId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Account",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    classList: {
        type: sequelize_1.DataTypes.JSON, // Change to JSON to support arrays in MySQL
        allowNull: true,
        defaultValue: [],
    },
    assignmentsCreated: {
        type: sequelize_1.DataTypes.JSON, // Change to JSON to support arrays in MySQL
        allowNull: true,
        defaultValue: [],
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
    tableName: "Teacher",
    timestamps: true,
    charset: "utf8",
});
