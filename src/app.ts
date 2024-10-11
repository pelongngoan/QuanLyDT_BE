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
