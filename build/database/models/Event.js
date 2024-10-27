"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const sequelize_1 = require("sequelize");
const Class_1 = require("./Class");
class Event extends sequelize_1.Model {
    static associate(models) {
        Event.belongsTo(models.Class, {
            foreignKey: "classId",
            onDelete: "CASCADE",
        });
    }
}
exports.Event = Event;
exports.default = (sequelize) => {
    Event.init({
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
        name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    }, {
        sequelize,
        modelName: "Event",
    });
    return Event;
};
