import { loadControllers, scopePerRequest } from "awilix-express";
import express from "express";

import container from "./container";

const app = express();

app.use(express.json());
app.use(scopePerRequest(container));

app.use(loadControllers("controllers/*.ts", { cwd: __dirname }));

app.use((req, res, next) => {
  console.log(`Incoming request for ${req.url}`);
  next();
});

app.get("/health", (_, res) => {
  res.send("OK");
});

export default app;
