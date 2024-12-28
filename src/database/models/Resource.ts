import { DataTypes, Model, Sequelize } from "sequelize";
import { Class } from "./Class";

export class Resource extends Model {
  declare id: string;
  declare classId: string;
  declare name: string;
  //   declare type: string;
  declare description: string;
  declare url: string;

  static associate(models: any) {
    Resource.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Resource.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.UUID,
        references: {
          model: Class,
          key: "id",
        },
        allowNull: false,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING(255), allowNull: false },
      //   type: { type: DataTypes.STRING(50), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      sequelize,
      modelName: "Resource",
    }
  );
  return Resource;
};
