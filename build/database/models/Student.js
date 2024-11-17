"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const sequelize_1 = require("sequelize");
const Account_1 = require("./Account");
class Student extends sequelize_1.Model {
    static associate(models) {
        Student.belongsTo(models.Account, {
            foreignKey: "accountId",
            onDelete: "CASCADE",
        });
        Student.belongsToMany(models.Class, {
            through: "ClassStudents",
            foreignKey: "studentId",
        });
    }
}
exports.Student = Student;
exports.default = (sequelize) => {
    Student.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Account_1.Account,
                key: "id",
            },
            allowNull: false,
        },
        major: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
        enrollmentYear: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: true },
    }, {
        sequelize,
        modelName: "Student",
    });
    return Student;
};
