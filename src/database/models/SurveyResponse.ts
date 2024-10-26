import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";
import { Survey } from "./Survey"; // Adjust import based on your structure

class SurveyResponse extends Model {
  declare id: string;
  declare surveyId: string; // Reference to Survey
  declare userId: string; // User who submitted the response
  declare answers: { questionId: string; answer: string }[]; // Array of answers

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

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
      references: {
        model: "Surveys",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    answers: {
      type: DataTypes.ARRAY(DataTypes.JSONB), // Store question IDs with answers
      allowNull: false,
      defaultValue: [],
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
    tableName: "SurveyResponses",
    timestamps: true,
    charset: "utf8",
  }
);

SurveyResponse.belongsTo(Survey, { foreignKey: "surveyId" });

export { SurveyResponse };
