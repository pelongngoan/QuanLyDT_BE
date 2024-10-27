"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const sequelize_1 = require("sequelize");
const Class_1 = require("./Class");
class Resource extends sequelize_1.Model {
    static associate(models) {
        Resource.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.Resource = Resource;
exports.default = (sequelize) => {
    Resource.init({
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
        name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        description: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
        //   type: { type: DataTypes.STRING(50), allowNull: false },
        url: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    }, {
        sequelize,
        modelName: "Resource",
    });
    return Resource;
};
