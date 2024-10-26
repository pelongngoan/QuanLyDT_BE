import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../db";
import { Class } from "./Class";
import { Student } from "./Student";

class AbsenceRequest extends Model {
  declare id: string;
  declare userId: string;
  declare classId: string;
  declare date: Date;
  declare reason: string;
  declare status: "PENDING" | "APPROVED" | "DENIED";
}

AbsenceRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Class,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "DENIED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "AbsenceRequests",
    timestamps: true,
  }
);

AbsenceRequest.belongsTo(Class, { foreignKey: "classId" });
AbsenceRequest.belongsTo(Student, { foreignKey: "userId" });

export { AbsenceRequest };
