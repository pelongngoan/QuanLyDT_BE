import { DataTypes, Model, Sequelize } from "sequelize";
import { Account } from "./Account";
import { sequelizeConnection } from "../db";

export class Teacher extends Model {
  declare id: string;
  declare accountId: string;
  declare specialization: string | null;
  declare bio: string | null;

  static associate(models: any) {
    Teacher.belongsTo(models.Account, {
      foreignKey: "accountId",
      onDelete: "CASCADE",
    });
    Teacher.hasMany(models.Class, {
      foreignKey: "teacherId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Teacher.init(
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
      specialization: { type: DataTypes.STRING(100), allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize: sequelizeConnection,

      modelName: "Teacher",
    }
  );
  return Teacher;
};
