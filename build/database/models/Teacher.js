"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const sequelize_1 = require("sequelize");
const Account_1 = require("./Account");
class Teacher extends sequelize_1.Model {
    static associate(models) {
        Teacher.belongsTo(models.Account, {
            foreignKey: "accountId",
            onDelete: "CASCADE",
        });
        Teacher.hasMany(models.Class, {
            foreignKey: "teacherId",
            onDelete: "CASCADE",
        });
    }
}
exports.Teacher = Teacher;
exports.default = (sequelize) => {
    Teacher.init({
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
        specialization: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
        bio: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    }, {
        sequelize,
        modelName: "Teacher",
    });
    return Teacher;
};
