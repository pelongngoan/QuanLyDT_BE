import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Survey extends Model {
  declare id: string;
  declare title: string;
  declare description: string;
  declare questions: { question: string; options: string[] }[]; // Array of questions with options
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Survey.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    questions: {
      type: DataTypes.ARRAY(DataTypes.JSONB), // Store questions and options
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
    tableName: "Surveys",
    timestamps: true,
    charset: "utf8",
  }
);

export { Survey };
