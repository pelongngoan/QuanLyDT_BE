"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Notification extends sequelize_1.Model {
}
exports.Notification = Notification;
Notification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    recipientId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Account", // Assume notifications are for accounts (teachers and students)
            key: "id",
        },
        onDelete: "CASCADE",
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("GENERAL", "REMINDER", "ALERT"),
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    tableName: "Notification",
    timestamps: true,
    charset: "utf8",
});
