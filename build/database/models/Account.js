"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.STATE = exports.ROLE = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "admin";
    ROLE["TEACHER"] = "teacher";
    ROLE["STUDENT"] = "student";
})(ROLE || (exports.ROLE = ROLE = {}));
var STATE;
(function (STATE) {
    STATE["ACTIVE"] = "active";
    STATE["LOCKED"] = "locked";
    STATE["PENDING"] = "pending";
})(STATE || (exports.STATE = STATE = {}));
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
    }
    isEmailVerified() {
        return this.state === STATE.ACTIVE;
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
            type: sequelize_1.DataTypes.ENUM(...Object.values(ROLE)),
            allowNull: false,
        },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        token: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        state: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(STATE)),
            defaultValue: STATE.PENDING,
        },
        verificationCode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        avatar: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Account",
    });
    return Account;
};
// export { Account };
