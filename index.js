import dotenv from "dotenv";
import Client from "./src/Class/Client.js";

dotenv.config();

new Client().Start();

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});
