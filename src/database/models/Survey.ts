import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class Survey extends Model {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare classId: string;

  static associate(models: any) {
    Survey.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
    Survey.hasMany(models.SurveyResponse, {
      foreignKey: "surveyId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Survey.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Survey",
    }
  );
  return Survey;
};
