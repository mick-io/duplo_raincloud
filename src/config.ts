import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]),
  PORT: z.preprocess((val) => Number(val), z.number().min(1024).max(65535)),
  OPEN_METEO_BASE_URL: z.string().url(),
  MONGO_URI: z.string().url(),
});

const parsedConfig = ConfigSchema.parse(process.env);

const config = {
  nodeENV: parsedConfig.NODE_ENV || "dev",
  port: parsedConfig.PORT || 4001,
  mongoURI: parsedConfig.MONGO_URI || "mongodb://root:example@localhost:27017/",
  openMeteoBaseURL:
    parsedConfig.OPEN_METEO_BASE_URL || "https://api.open-meteo.com",
} as const;

export type ConfigType = typeof config;

export default config;
