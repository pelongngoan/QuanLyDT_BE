import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class Submission extends Model {
  declare id: string;
  declare studentId: string;
  declare assignmentId: string;
  declare fileUrl: string;
  declare submittedAt: Date;

  static associate(models: any) {
    Submission.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
    Submission.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Submission.init(
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
      assignmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "Submission",
    }
  );
  return Submission;
};
