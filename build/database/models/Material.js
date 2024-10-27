"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Material extends sequelize_1.Model {
    static associate(models) {
        Material.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.Material = Material;
exports.default = (sequelize) => {
    Material.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        fileUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        classId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Material",
    });
    return Material;
};
