import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class SurveyResponse extends Model {
  declare id: string;
  declare surveyId: string;
  declare studentId: string;
  declare response: string;

  static associate(models: any) {
    SurveyResponse.belongsTo(models.Survey, {
      foreignKey: "surveyId",
      onDelete: "CASCADE",
    });
    SurveyResponse.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  SurveyResponse.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      surveyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "SurveyResponse",
    }
  );
  return SurveyResponse;
};
