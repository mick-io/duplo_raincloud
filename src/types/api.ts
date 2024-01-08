import { z } from "zod";
import { OpenMeteoHourlyTempResponseBody } from "../schemas/open-meteo.schema";

export type OpenMeteoHourlyTempResponseBody = z.infer<
  typeof OpenMeteoHourlyTempResponseBody
>;
