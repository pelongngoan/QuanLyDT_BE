"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const enum_1 = require("../enum/enum");
class Account extends sequelize_1.Model {
}
exports.Account = Account;
Account.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
    },
    // firstName: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // lastName: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            isSisHustEmail(value) {
                if (!value.endsWith("@sis.hust.edu.vn")) {
                    throw new Error("Email must end with @sis.hust.edu.vn");
                }
            },
        },
    },
    role: {
        type: sequelize_1.DataTypes.ENUM,
        values: [enum_1.ROLE.ADMIN, enum_1.ROLE.STUDENT, enum_1.ROLE.TEACHER],
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.ENUM,
        values: [enum_1.STATE.ACTIVE, enum_1.STATE.INACTIVE],
        allowNull: false,
        defaultValue: enum_1.STATE.INACTIVE,
    },
    verificationCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
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
    tableName: "Account",
    timestamps: true,
    charset: "utf8",
});
