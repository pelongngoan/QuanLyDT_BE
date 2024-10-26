import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../db";
import { Class } from "./Class";
import { Student } from "./Student";

class AttendanceRecord extends Model {
  declare id: string;
  declare classId: string;
  declare studentId: string;
  declare date: Date;
  declare status: "PRESENT" | "ABSENT_WITH_LEAVE" | "ABSENT_WITHOUT_LEAVE";

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AttendanceRecord.init(
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
        model: Class,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PRESENT",
        "ABSENT_WITH_LEAVE",
        "ABSENT_WITHOUT_LEAVE"
      ),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "AttendanceRecords",
    timestamps: true,
  }
);

AttendanceRecord.belongsTo(Class, { foreignKey: "classId" });
AttendanceRecord.belongsTo(Student, { foreignKey: "studentId" });
Class.hasMany(AttendanceRecord, { foreignKey: "classId" });
Student.hasMany(AttendanceRecord, { foreignKey: "studentId" });

export { AttendanceRecord };
