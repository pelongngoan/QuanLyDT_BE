import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Assignment extends Model {
  declare id: string;
  declare title: string;
  declare description: string;
  declare teacherId: string; // Reference to Teacher
  declare classId: string; // Reference to Class
  declare dueDate: Date;
  declare submittedBy: string[]; // Array of student IDs
  declare gradingStatus: string;
  declare score: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Assignment.init(
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Teacher",
        key: "id",
      },
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Class",
        key: "id",
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    submittedBy: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    gradingStatus: {
      type: DataTypes.ENUM("NOT_GRADED", "IN_PROGRESS", "GRADED"),
      allowNull: false,
      defaultValue: "NOT_GRADED",
    },
    score: {
      type: DataTypes.FLOAT,
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
    tableName: "Assignment",
    timestamps: true,
    charset: "utf8",
  }
);

export { Assignment };
