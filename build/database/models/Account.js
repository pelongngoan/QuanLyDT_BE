"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const enum_1 = require("../enum/enum");
class Account extends sequelize_1.Model {
    static associate(models) {
        Account.hasMany(models.Notification, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });
        Account.hasMany(models.Message, {
            foreignKey: "senderId",
            onDelete: "CASCADE",
        });
        Account.hasMany(models.Message, {
            foreignKey: "receiverId",
            onDelete: "CASCADE",
        });
        Account.hasOne(models.Teacher, {
            foreignKey: "accountId",
            onDelete: "CASCADE",
        });
        Account.hasOne(models.Student, {
            foreignKey: "accountId",
            onDelete: "CASCADE",
        });
    }
    // Helper Method: Check if email is verified
    isEmailVerified() {
        return this.state === enum_1.STATE.ACTIVE;
    }
    // Helper Method: Generate a full name
    getFullName() {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        }
        return null;
    }
}
exports.Account = Account;
exports.default = (sequelize) => {
    Account.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
        lastName: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
        email: { type: sequelize_1.DataTypes.STRING(100), allowNull: false, unique: true },
        role: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(enum_1.ROLE)),
            allowNull: false,
        },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        token: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        state: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(enum_1.STATE)),
            defaultValue: enum_1.STATE.PENDING,
            allowNull: false,
        },
        verificationCode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        avatar: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Account",
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    });
    return Account;
};
