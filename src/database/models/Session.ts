import { DataTypes, Model, Sequelize } from "sequelize";
import { Class } from "./Class";
import { sequelizeConnection } from "../db";

export class Session extends Model {
  declare id: string;
  declare classId: string;
  declare date: Date;
  declare topic: string | null;

  static associate(models: any) {
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

export default (sequelize: Sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.UUID,
        references: {
          model: Class,
          key: "id",
        },
        allowNull: false,
      },
      date: { type: DataTypes.DATE, allowNull: false },
      topic: { type: DataTypes.STRING(100), allowNull: true },
    },
    {
      sequelize,

      modelName: "Session",
    }
  );
  return Session;
};
