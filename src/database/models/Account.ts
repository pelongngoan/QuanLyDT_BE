import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeConnection } from "../db";
import { ROLE, STATE } from "../enum/enum";

export class Account extends Model {
  declare id: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare email: string;
  declare role: ROLE;
  declare password: string;
  declare token: string | null;
  declare state: STATE;
  declare verificationCode: string | null;
  declare avatar: string | null;

  static associate(models: any) {
    Account.hasMany(models.Notification, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Account.hasMany(models.Message, {
      foreignKey: "senderId",
      onDelete: "CASCADE",
    });
    Account.hasMany(models.Message, {
      foreignKey: "receiverId",
      onDelete: "CASCADE",
    });
  }

  isEmailVerified() {
    return this.state === STATE.ACTIVE;
  }
}

export default (sequelize: Sequelize) => {
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: { type: DataTypes.STRING(50), allowNull: true },
      lastName: { type: DataTypes.STRING(50), allowNull: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLE)),
        allowNull: false,
      },
      password: { type: DataTypes.STRING, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: true },
      state: {
        type: DataTypes.ENUM(...Object.values(STATE)),
        defaultValue: STATE.PENDING,
      },
      verificationCode: { type: DataTypes.STRING, allowNull: true },
      avatar: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "Account",
    }
  );
  return Account;
};
// export { Account };
