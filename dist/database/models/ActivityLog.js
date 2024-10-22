"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class ActivityLog extends sequelize_1.Model {
}
exports.ActivityLog = ActivityLog;
ActivityLog.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    accountId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Account",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    action: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
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
    tableName: "ActivityLog",
    timestamps: true,
    charset: "utf8",
});
