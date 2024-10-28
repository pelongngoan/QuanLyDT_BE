import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class ClassStudent extends Model {
  declare id: string;
  declare classId: string;
  declare studentId: string;
  declare enrollmentDate: Date;

  static associate(models: any) {
    ClassStudent.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
    ClassStudent.belongsTo(models.Student, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  ClassStudent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ClassStudent",
    }
  );
  return ClassStudent;
};
