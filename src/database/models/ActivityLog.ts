import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class ActivityLog extends Model {
  declare id: string;
  declare accountId: string;
  declare action: string;
  declare description: string;
  declare timestamp: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ActivityLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "ActivityLog",
    timestamps: true,
    charset: "utf8",
  }
);

export { ActivityLog };
