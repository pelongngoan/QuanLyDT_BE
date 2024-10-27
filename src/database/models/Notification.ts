import { DataTypes, Model, Sequelize } from "sequelize";
import { Account } from "./Account";
import { sequelizeConnection } from "../db";

export class Notification extends Model {
  declare id: string;
  declare message: string;
  declare type: string;
  declare userId: string;
  declare isRead: boolean;

  static associate(models: any) {
    Notification.belongsTo(models.Account, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      message: { type: DataTypes.STRING(255), allowNull: false },
      type: { type: DataTypes.STRING(50), allowNull: true },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: Account,
          key: "id",
        },
        allowNull: false,
      },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize: sequelizeConnection,

      modelName: "Notification",
    }
  );
  return Notification;
};
