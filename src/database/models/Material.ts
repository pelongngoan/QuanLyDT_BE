import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";

export class Material extends Model {
  declare id: string;
  declare title: string;
  declare description: string | null;
  declare fileUrl: string;
  declare classId: string;

  static associate(models: any) {
    Material.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Material.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Material",
    }
  );
  return Material;
};
