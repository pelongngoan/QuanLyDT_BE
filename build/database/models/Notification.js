"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const Account_1 = require("./Account");
class Notification extends sequelize_1.Model {
    static associate(models) {
        Notification.belongsTo(models.Account, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
    }
}
exports.Notification = Notification;
exports.default = (sequelize) => {
    Notification.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        message: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
        type: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: Account_1.Account,
                key: "id",
            },
            allowNull: false,
        },
        isRead: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    }, {
        sequelize,
        modelName: "Notification",
    });
    return Notification;
};
