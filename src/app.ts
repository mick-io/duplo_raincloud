import { loadControllers, scopePerRequest } from "awilix-express";
import express from "express";
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

app.use((req, _, next) => {
  console.log(`Incoming request for ${req.url}`);
  next();
});

export default app;
