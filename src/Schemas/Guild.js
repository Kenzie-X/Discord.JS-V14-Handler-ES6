import mongoose from "mongoose";

export default mongoose.model(
  "Guild",
  new mongoose.Schema({
    guild: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
    },
  })
);
