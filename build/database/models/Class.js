"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const sequelize_1 = require("sequelize");
const Teacher_1 = require("./Teacher");
const enum_1 = require("../enum/enum");
class Class extends sequelize_1.Model {
    static associate(models) {
        Class.belongsTo(models.Teacher, {
            foreignKey: "teacherId",
            onDelete: "CASCADE",
        });
        Class.belongsToMany(models.Student, {
            through: "ClassStudents",
            foreignKey: "classId",
        });
    }
}
exports.Class = Class;
exports.default = (sequelize) => {
    Class.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        className: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        semester: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "N/A",
        },
        maxStudents: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
        startDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        endDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        teacherId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Teacher_1.Teacher,
                key: "id",
            },
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(enum_1.CLASSSTATE)),
            defaultValue: enum_1.CLASSSTATE.CLOSE,
        },
    }, {
        sequelize,
        modelName: "Class",
    });
    return Class;
};
