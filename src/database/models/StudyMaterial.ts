import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class StudyMaterial extends Model {
  declare id: string;
  declare classId: string; // Reference to Class
  declare title: string;
  declare description: string;
  declare link: string;
  declare type: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StudyMaterial.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Class",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("LECTURE", "READING", "VIDEO"),
      allowNull: false,
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
    tableName: "StudyMaterial",
    timestamps: true,
    charset: "utf8",
  }
);

export { StudyMaterial };
