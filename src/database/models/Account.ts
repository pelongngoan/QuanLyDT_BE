import { DataTypes, Model } from "sequelize";
import { v4 as uuid } from "uuid";
import { sequelizeConnection } from "../db";
import { ROLE, STATE } from "../enum/enum";

class Account extends Model {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare email: string;
  declare role: string;
  declare password: string;
  declare token: string;
  declare state: string;
  declare verificationCode: string;
  declare avatar: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isSisHustEmail(value: string) {
          if (!value.endsWith("@sis.hust.edu.vn")) {
            throw new Error("Email must end with @sis.hust.edu.vn");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: [ROLE.ADMIN, ROLE.STUDENT, ROLE.TEACHER],
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM,
      values: [STATE.ACTIVE, STATE.INACTIVE],
      allowNull: false,
      defaultValue: STATE.INACTIVE,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "Account",
    timestamps: true,
    charset: "utf8",
  }
);

export { Account };
