"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Attendance extends sequelize_1.Model {
}
exports.Attendance = Attendance;
Attendance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    classId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Class",
            key: "id",
        },
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    studentList: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB), // Store each student with status
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidAttendance(value) {
                value.forEach((item) => {
                    if (![
                        "PRESENT",
                        "ABSENT_WITH_LEAVE",
                        "ABSENT_WITHOUT_LEAVE",
                    ].includes(item.status)) {
                        throw new Error("Invalid attendance status");
                    }
                });
            },
        },
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
    tableName: "Attendance",
    timestamps: true,
    charset: "utf8",
});
