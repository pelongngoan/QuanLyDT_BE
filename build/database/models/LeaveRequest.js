"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequest = void 0;
const sequelize_1 = require("sequelize");
const Student_1 = require("./Student");
const Class_1 = require("./Class");
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
            references: {
                model: Student_1.Student,
                key: "id",
            },
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: Class_1.Class,
                key: "id",
            },
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
            type: sequelize_1.DataTypes.ENUM("PENDING", "APPROVED", "DENIED"),
            allowNull: false,
            defaultValue: "PENDING",
        },
    }, {
        sequelize,
        modelName: "LeaveRequest",
    });
    return LeaveRequest;
};
