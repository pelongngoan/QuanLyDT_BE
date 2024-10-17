import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Class extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare teacherId: string;
  declare studentList: string[];
  declare assignments: string[];
  declare schedule: string;
  declare maxStudents: number;
  declare startDate: Date;
  declare endDate: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Teacher",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    studentList: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    assignments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
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
    tableName: "Class",
    timestamps: true,
    charset: "utf8",
  }
);

export { Class };
