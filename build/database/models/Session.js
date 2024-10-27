"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = require("sequelize");
const Class_1 = require("./Class");
const db_1 = require("../db");
class Session extends sequelize_1.Model {
    static associate(models) {
        Session.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
        Session.hasMany(models.Attendance, {
            foreignKey: "sessionId",
            onDelete: "CASCADE",
        });
    }
}
exports.Session = Session;
exports.default = (sequelize) => {
    Session.init({
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
        date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        topic: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
    }, {
        sequelize: db_1.sequelizeConnection,
        modelName: "Session",
    });
    return Session;
};
