import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";
import { ATTENDANCESTATUS } from "../enum/enum";

class Student extends Model {
  declare id: string;
  declare accountId: string;
  declare classList: string[]; // Array of class IDs
  declare assignmentSubmissions: string[]; // Array of submitted assignment IDs
  declare attendanceStatus: string; // Enum for attendance status
  declare schedule: string; // A field to represent the student's schedule

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    classList: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    assignmentSubmissions: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    attendanceStatus: {
      type: DataTypes.ENUM,
      values: [ATTENDANCESTATUS.ABSENT, ATTENDANCESTATUS.PRESENT],
      allowNull: false,
      defaultValue: ATTENDANCESTATUS.PRESENT,
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
    tableName: "Student",
    timestamps: true,
    charset: "utf8",
  }
);

export { Student };
