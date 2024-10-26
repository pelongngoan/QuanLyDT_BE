import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../db";
import { Class } from "./Class";

class Material extends Model {
  declare id: string;
  declare classId: string;
  declare title: string;
  declare description: string;
  declare fileUrl: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Material.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Materials",
    timestamps: true,
  }
);

Material.belongsTo(Class, { foreignKey: "classId" });

export { Material };
