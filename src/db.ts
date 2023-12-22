import mongoose from "mongoose";
import container from "./container";

const config = container.resolve("config");

mongoose
  .connect(config.mongoURI, { connectTimeoutMS: 10000 })
  .then(() => {
    console.info("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
