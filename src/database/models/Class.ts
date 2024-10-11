import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Class extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare teacherId: string; // Reference to the Teacher
  declare studentList: string[]; // Array of student IDs
  declare assignments: string[]; // Array of assignment IDs
  declare schedule: string; // Schedule information

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
      allowNull: false,
      references: {
        model: "Teacher", // Reference to Teacher model
        key: "id",
      },
      onDelete: "SET NULL",
    },
    studentList: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    assignments: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
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
