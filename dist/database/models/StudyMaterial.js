"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyMaterial = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class StudyMaterial extends sequelize_1.Model {
}
exports.StudyMaterial = StudyMaterial;
StudyMaterial.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    classId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Class",
            key: "id",
        },
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("LECTURE", "READING", "VIDEO"),
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelizeConnection,
    tableName: "StudyMaterial",
    timestamps: true,
    charset: "utf8",
});
