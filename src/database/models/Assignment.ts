import { DataTypes, Model, Sequelize } from "sequelize";
import { Class } from "./Class";
import { sequelizeConnection } from "../db";

export class Assignment extends Model {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare dueDate: Date;
  declare classId: string;

  static associate(models: any) {
    Assignment.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Assignment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      dueDate: { type: DataTypes.DATE, allowNull: false },
      classId: {
        type: DataTypes.UUID,
        references: {
          model: Class,
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "Assignment",
    }
  );
  return Assignment;
};
