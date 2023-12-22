import mongoose from "mongoose";
import { Log } from "../Functions/index.js";

import config from "../config.js";

export default async () => {
  Log("Connecting to MongoDB..", "info");

  await mongoose // Chain
    .connect(process.env.MONGODB_URI || config.handler.mongodb.uri)
    .then(() => {
      Log("Connected to MongoDB!", "done");
    });
};
