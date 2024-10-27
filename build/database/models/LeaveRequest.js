"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequest = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class LeaveRequest extends sequelize_1.Model {
    static associate(models) {
        LeaveRequest.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
        LeaveRequest.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.LeaveRequest = LeaveRequest;
exports.default = (sequelize) => {
    LeaveRequest.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
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
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "pending",
        },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "LeaveRequest",
    });
    return LeaveRequest;
};
