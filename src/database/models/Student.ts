import { DataTypes, Model, Sequelize } from "sequelize";
import { Account } from "./Account";
import { sequelizeConnection } from "../db";

export class Student extends Model {
  declare id: string;
  declare accountId: string;
  declare major: string | null;
  declare enrollmentYear: number;

  static associate(models: any) {
    Student.belongsTo(models.Account, {
      foreignKey: "accountId",
      onDelete: "CASCADE",
    });
    Student.belongsToMany(models.Class, {
      through: "ClassStudents",
      foreignKey: "studentId",
    });
  }
}

export default (sequelize: Sequelize) => {
  Student.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        references: {
          model: Account,
          key: "id",
        },
        allowNull: false,
      },
      major: { type: DataTypes.STRING(100), allowNull: true },
      enrollmentYear: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize: sequelizeConnection,

      modelName: "Student",
    }
  );
  return Student;
};
