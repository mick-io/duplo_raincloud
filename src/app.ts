import { loadControllers, scopePerRequest } from "awilix-express";
import express, { Response } from "express";
import mongoose from "mongoose";
import path from "path";

import container from "./container";

const app = express();

app.use(express.json());

app.use(scopePerRequest(container));

app.use(
  loadControllers("controllers/*" + path.extname(__filename), {
    cwd: __dirname,
    ignore: ["controllers/*.spec.ts"],
  }),
);

app.use((req, res, next) => {
  console.log(`Incoming request for ${req.url}`);
  next();
});

app.get("/health", async (_, res: Response) => {
  const isDatabaseOk =
    mongoose.connection.readyState != mongoose.ConnectionStates.connected;

  const isWeatherServiceOk = await container
    .resolve("weatherApiService")
    .healthCheck();

  res.json({
    server: "OK",
    database: isDatabaseOk ? "ERROR" : "OK",
    weatherService: isWeatherServiceOk ? "OK" : "ERROR",
  });
});

export default app;
