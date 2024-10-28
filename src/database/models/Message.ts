import { DataTypes, Model, Sequelize } from "sequelize";
import { Account } from "./Account";
import { sequelizeConnection } from "../db";

export class Message extends Model {
  declare id: string;
  declare senderId: string;
  declare receiverId: string;
  declare content: string;
  declare timestamp: Date;

  static associate(models: any) {
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

export default (sequelize: Sequelize) => {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        references: {
          model: Account,
          key: "id",
        },
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        references: {
          model: Account,
          key: "id",
        },
        allowNull: false,
      },
      content: { type: DataTypes.TEXT, allowNull: false },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,

      modelName: "Message",
    }
  );
  return Message;
};
