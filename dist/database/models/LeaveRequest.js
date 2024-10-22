"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequest = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class LeaveRequest extends sequelize_1.Model {
}
exports.LeaveRequest = LeaveRequest;
LeaveRequest.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Student",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    classId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Class",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
    },
    requestTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    responseTime: {
        type: sequelize_1.DataTypes.DATE,
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
    tableName: "LeaveRequest",
    timestamps: true,
    charset: "utf8",
});
