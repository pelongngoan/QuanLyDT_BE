import { DataTypes, Model, Sequelize } from "sequelize";
import { Student } from "./Student";
import { Class } from "./Class";
import { sequelizeConnection } from "../db";

export class LeaveRequest extends Model {
  declare id: string;
  declare studentId: string;
  declare classId: string;
  declare startDate: Date;
  declare endDate: Date;
  declare reason: string;
  declare status: "PENDING" | "APPROVED" | "DENIED";

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
        references: {
          model: Student,
          key: "id",
        },
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Class,
          key: "id",
        },
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
        type: DataTypes.ENUM("PENDING", "APPROVED", "DENIED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      modelName: "LeaveRequest",
    }
  );
  return LeaveRequest;
};
