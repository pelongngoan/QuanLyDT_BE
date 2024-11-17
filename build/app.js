"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config/config");
const router_1 = require("./router"); // Import your main router
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Enable CORS
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // Ensure JSON parsing middleware is added
app.use(router_1.router); // Register router with app
(0, config_1.config)(app).then(() => {
    console.log("Config successfully.");
});
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
// import express, { Request, Response } from "express";
// import dotenv from "dotenv";
// import { config } from "./config/config"; // Ensure this config function includes database sync
// import { router } from "./router"; // Import your main router
// import { sequelizeConnection } from "./database/db"; // Import your Sequelize connection
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;
// app.use(express.json()); // Ensure JSON parsing middleware is added
// app.use(router); // Register router with app
// const startApp = async () => {
//   try {
//     await config(app); // Ensure the configuration is done before syncing
//     console.log("Config successfully.");
//     // Sync database models
//     await sequelizeConnection.sync({ alter: true }); // Change to { force: true } in development if needed
//     console.log("Database synced successfully.");
//     // Start the server after successful sync
//     app.listen(port, () => {
//       console.log(`[server]: Server is running at http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error("Error starting the application:", error);
//   }
// };
// startApp();
// app.get("/", (req: Request, res: Response) => {
//   res.send("Tinggg!");
// });
