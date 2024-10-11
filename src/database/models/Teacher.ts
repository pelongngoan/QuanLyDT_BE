import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../db";

class Teacher extends Model {
  declare id: string;
  declare accountId: string;
  declare classList: string[]; // Array of class IDs
  declare assignmentsCreated: string[]; // Array of created assignment IDs

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Teacher.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account", // Reference to Account model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    classList: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    assignmentsCreated: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Teacher",
    timestamps: true,
    charset: "utf8",
  }
);

export { Teacher };
