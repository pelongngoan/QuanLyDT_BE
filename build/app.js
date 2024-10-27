"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config/config");
const router_1 = require("./router"); // Import your main router
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json()); // Ensure JSON parsing middleware is added
app.use(router_1.router); // Register router with app
(0, config_1.config)(app).then(() => {
    console.log("Config successfully.");
});
app.get("/", (req, res) => {
    res.send("Tinggg!");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
