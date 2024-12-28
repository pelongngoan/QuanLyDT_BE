"use strict";
// import { Sequelize } from "sequelize";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeConnection = void 0;
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
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelizeConnection = new sequelize_1.Sequelize(process.env.DB_NAME || "", process.env.DB_USERNAME || "", process.env.DB_PASSWORD || "", {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3306"),
    // logging: console.log, // Enable logging
    dialect: "mysql",
    timezone: "+07:00",
});
exports.sequelizeConnection = sequelizeConnection;
const checkConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        sequelizeConnection.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (err) {
        console.error(`Unable to connect to the database, err: ${err}`);
    }
});
checkConnection();
