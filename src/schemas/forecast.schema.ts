import * as z from "zod";

const HourlyUnitsSchema = z.object({
  time: z.string(),
  temperature_2m: z.string(),
});

const HourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
});

export const ForecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  hourly_units: HourlyUnitsSchema,
  hourly: HourlySchema,
});

export type AddForecastDTO = z.infer<typeof ForecastSchema>;
