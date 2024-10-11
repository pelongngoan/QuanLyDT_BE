import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Notification extends Model {
  declare id: string;
  declare recipientId: string; // Student or Teacher ID
  declare content: string;
  declare type: string;
  declare isRead: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account", // Assume notifications are for accounts (teachers and students)
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("GENERAL", "REMINDER", "ALERT"),
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Notification",
    timestamps: true,
    charset: "utf8",
  }
);

export { Notification };
