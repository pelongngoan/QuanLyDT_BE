import { DataTypes, Model, Sequelize } from "sequelize";
import { Student } from "./Student";
import { Assignment } from "./Assignment";
import { sequelizeConnection } from "../db";

export class Grade extends Model {
  declare id: string;
  declare assignmentId: string;
  declare studentId: string;
  declare grade: number | null;
  declare comments: string | null;

  static associate(models: any) {
    Grade.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      onDelete: "CASCADE",
    });
    Grade.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Grade.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assignmentId: {
        type: DataTypes.UUID,
        references: {
          model: Assignment,
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
      grade: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      comments: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,

      modelName: "Grade",
    }
  );
  return Grade;
};
