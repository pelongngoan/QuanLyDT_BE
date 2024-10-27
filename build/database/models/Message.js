"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const sequelize_1 = require("sequelize");
const Account_1 = require("./Account");
const db_1 = require("../db");
class Message extends sequelize_1.Model {
    static associate(models) {
        Message.belongsTo(models.Account, {
            as: "Sender",
            foreignKey: "senderId",
            onDelete: "CASCADE",
        });
        Message.belongsTo(models.Account, {
            as: "Receiver",
            foreignKey: "receiverId",
            onDelete: "CASCADE",
        });
    }
}
exports.Message = Message;
exports.default = (sequelize) => {
    Message.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        senderId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Account_1.Account,
                key: "id",
            },
            allowNull: false,
        },
        receiverId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Account_1.Account,
                key: "id",
            },
            allowNull: false,
        },
        content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        timestamp: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Message",
    });
    return Message;
};
