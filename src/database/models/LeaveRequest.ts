import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class LeaveRequest extends Model {
  declare id: string;
  declare studentId: string;
  declare classId: string;
  declare startDate: Date;
  declare endDate: Date;
  declare reason: string;
  declare status: string;

  static associate(models: any) {
    LeaveRequest.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
    LeaveRequest.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
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
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "LeaveRequest",
    }
  );
  return LeaveRequest;
};
