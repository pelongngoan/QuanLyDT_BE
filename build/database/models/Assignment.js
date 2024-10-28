"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const sequelize_1 = require("sequelize");
const Class_1 = require("./Class");
class Assignment extends sequelize_1.Model {
    static associate(models) {
        Assignment.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.Assignment = Assignment;
exports.default = (sequelize) => {
    Assignment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        dueDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Class_1.Class,
                key: "id",
            },
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Assignment",
    });
    return Assignment;
};
