"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const enum_1 = require("../enum/enum");
class Student extends sequelize_1.Model {
}
exports.Student = Student;
Student.init({
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
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
    },
    assignmentSubmissions: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
    },
    attendanceStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: [enum_1.ATTENDANCESTATUS.ABSENT, enum_1.ATTENDANCESTATUS.PRESENT],
        allowNull: false,
        defaultValue: enum_1.ATTENDANCESTATUS.PRESENT,
    },
    schedule: {
        type: sequelize_1.DataTypes.TEXT,
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
    tableName: "Student",
    timestamps: true,
    charset: "utf8",
});
