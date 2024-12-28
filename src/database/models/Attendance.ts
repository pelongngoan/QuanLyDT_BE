import { DataTypes, Model, Sequelize } from "sequelize";
import { Student } from "./Student";
import { Session } from "./Session";
import { sequelizeConnection } from "../db";

export class Attendance extends Model {
  declare id: string;
  declare sessionId: string;
  declare studentId: string;
  declare isPresent: boolean;
  declare date: Date;

  static associate(models: any) {
    Attendance.belongsTo(models.Session, {
      foreignKey: "sessionId",
      onDelete: "CASCADE",
    });
    Attendance.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Attendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.UUID,
        references: {
          model: Session,
          key: "id",
        },
        allowNull: false,
      },
      studentId: {
        type: DataTypes.UUID,
        references: {
          model: Student,
          key: "id",
        },
        allowNull: false,
      },
      isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
