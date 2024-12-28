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
    Account.hasOne(models.Teacher, {
      foreignKey: "accountId",
      onDelete: "CASCADE",
    });
    Account.hasOne(models.Student, {
      foreignKey: "accountId",
      onDelete: "CASCADE",
    });
  }

  // Helper Method: Check if email is verified
  isEmailVerified(): boolean {
    return this.state === STATE.ACTIVE;
  }

  // Helper Method: Generate a full name
  getFullName(): string | null {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return null;
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
        allowNull: false,
      },
      verificationCode: { type: DataTypes.STRING, allowNull: true },
      avatar: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize: sequelizeConnection,
      modelName: "Account",
      timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
  );

  return Account;
};
