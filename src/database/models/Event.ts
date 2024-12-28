import { DataTypes, Model, Sequelize } from "sequelize";
import { Class } from "./Class";

export class Event extends Model {
  declare id: string;
  declare classId: string;
  declare name: string;
  declare date: Date;
  declare description: string | null;

  static associate(models: any) {
    Event.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Event.init(
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
      date: { type: DataTypes.DATE, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
