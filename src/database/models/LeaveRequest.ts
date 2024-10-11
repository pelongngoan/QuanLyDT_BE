import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class LeaveRequest extends Model {
  declare id: string;
  declare studentId: string;
  declare classId: string;
  declare reason: string;
  declare status: string;
  declare requestTime: Date;
  declare responseTime: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

LeaveRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Student",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Class",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    requestTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    responseTime: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "LeaveRequest",
    timestamps: true,
    charset: "utf8",
  }
);

export { LeaveRequest };
