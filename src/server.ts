import "./db";

import app from "./app";
import container from "./container";

const config = container.resolve("config");

app.listen(config.port, () => {
  console.info(`Server listening on port ${config.port}`);
});
