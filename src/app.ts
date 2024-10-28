import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { config } from "./config/config";
import { router } from "./router"; // Import your main router

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Ensure JSON parsing middleware is added
app.use(router); // Register router with app

config(app).then(() => {
  console.log("Config successfully.");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Tinggg!");
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
