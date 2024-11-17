"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const sequelize_1 = require("sequelize");
const Student_1 = require("./Student");
const Session_1 = require("./Session");
class Attendance extends sequelize_1.Model {
    static associate(models) {
        Attendance.belongsTo(models.Session, {
            foreignKey: "sessionId",
            onDelete: "CASCADE",
        });
        Attendance.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
    }
}
exports.Attendance = Attendance;
exports.default = (sequelize) => {
    Attendance.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        sessionId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Session_1.Session,
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
        isPresent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Attendance",
    });
    return Attendance;
};
