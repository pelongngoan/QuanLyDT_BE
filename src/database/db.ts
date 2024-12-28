// import { Sequelize } from "sequelize";

// import dotenv from "dotenv";

// dotenv.config();

// const sequelizeConnection = new Sequelize(
//   process.env.DB_NAME || "default",
//   process.env.DB_USERNAME || "default",
//   process.env.DB_PASSWORD || "default",
//   {
//     host: process.env.DB_HOST || "localhost",
//     port: Number(process.env.DB_PORT || "3306"),
//     logging: false,
//     dialect: "mysql",
//     timezone: "+07:00",
//   }
// );

// const checkConnection = async () => {
//   try {
//     await sequelizeConnection.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (err) {
//     console.error(`Unable to connect to the database, err: ${err}`);
//   }
// };
// checkConnection();

// export { sequelizeConnection };
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelizeConnection = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3306"),
    // logging: console.log, // Enable logging
    dialect: "mysql",
    timezone: "+07:00",
  }
);

const checkConnection = async () => {
  try {
    sequelizeConnection.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error(`Unable to connect to the database, err: ${err}`);
  }
};

checkConnection();

export { sequelizeConnection };
