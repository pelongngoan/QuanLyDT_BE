import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Attendance extends Model {
  declare id: string;
  declare classId: string; // Reference to Class
  declare date: Date;
  declare studentList: { studentId: string; status: string }[]; // Array of attendance records

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Attendance.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    studentList: {
      type: DataTypes.ARRAY(DataTypes.JSONB), // Store each student with status
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidAttendance(value: { studentId: string; status: string }[]) {
          value.forEach((item: { studentId: string; status: string }) => {
            if (
              ![
                "PRESENT",
                "ABSENT_WITH_LEAVE",
                "ABSENT_WITHOUT_LEAVE",
              ].includes(item.status)
            ) {
              throw new Error("Invalid attendance status");
            }
          });
        },
      },
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
    tableName: "Attendance",
    timestamps: true,
    charset: "utf8",
  }
);

export { Attendance };
