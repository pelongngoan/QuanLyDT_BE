"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassStudent = void 0;
const sequelize_1 = require("sequelize");
class ClassStudent extends sequelize_1.Model {
    static associate(models) {
        ClassStudent.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
        ClassStudent.belongsTo(models.Student, {
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
    }
}
exports.ClassStudent = ClassStudent;
exports.default = (sequelize) => {
    ClassStudent.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        enrollmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: "ClassStudent",
    });
    return ClassStudent;
};
