import { DataTypes, Model, Sequelize } from "sequelize";
import { Class } from "./Class";

export class Schedule extends Model {
  declare id: string;
  declare classId: string;
  declare dayOfWeek: number;
  declare startTime: string;
  declare endTime: string;
  declare location: string;

  static associate(models: any) {
    Schedule.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Schedule.init(
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
      dayOfWeek: { type: DataTypes.INTEGER, allowNull: false }, // 0 for Sunday, 6 for Saturday
      startTime: { type: DataTypes.TIME, allowNull: false },
      endTime: { type: DataTypes.TIME, allowNull: false },
      location: { type: DataTypes.STRING(45), allowNull: false },
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
