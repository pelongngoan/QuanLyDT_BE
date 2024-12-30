"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const sequelize_1 = require("sequelize");
const Class_1 = require("./Class");
class Schedule extends sequelize_1.Model {
    static associate(models) {
        Schedule.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.Schedule = Schedule;
exports.default = (sequelize) => {
    Schedule.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Class_1.Class,
                key: "id",
            },
            allowNull: false,
        },
        dayOfWeek: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }, // 0 for Sunday, 6 for Saturday
        startTime: { type: sequelize_1.DataTypes.TIME, allowNull: false },
        endTime: { type: sequelize_1.DataTypes.TIME, allowNull: false },
        location: { type: sequelize_1.DataTypes.STRING(45), allowNull: false },
    }, {
        sequelize,
        modelName: "Schedule",
    });
    return Schedule;
};
