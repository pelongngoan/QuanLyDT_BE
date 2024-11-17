import { DataTypes, Model, Sequelize } from "sequelize";
import { Teacher } from "./Teacher";
import { sequelizeConnection } from "../db";

export class Class extends Model {
  declare id: string;
  declare className: string;
  declare semester: string;
  declare maxStudents: number;
  declare startDate: Date;
  declare endDate: Date;
  declare teacherId: string;

  static associate(models: any) {
    Class.belongsTo(models.Teacher, {
      foreignKey: "teacherId",
      onDelete: "CASCADE",
    });
    Class.belongsToMany(models.Student, {
      through: "ClassStudents",
      foreignKey: "classId",
    });
  }
}

export default (sequelize: Sequelize) => {
  Class.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      className: { type: DataTypes.STRING(100), allowNull: false },
      semester: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "N/A",
      },
      maxStudents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      teacherId: {
        type: DataTypes.UUID,
        references: {
          model: Teacher,
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,

      modelName: "Class",
    }
  );
  return Class;
};
