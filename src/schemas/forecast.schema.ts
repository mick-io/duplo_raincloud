import * as z from "zod";

export const DailyUnitsSchema = z.object({
  time: z.string(),
  temperature_2m_max: z.string(),
  temperature_2m_min: z.string(),
});

export const DailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
});

export const ForecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  daily_units: DailyUnitsSchema,
  daily: DailySchema,
});

export type DailyUnits = z.infer<typeof DailyUnitsSchema>;
export type Daily = z.infer<typeof DailySchema>;
export type ForecastDTO = z.infer<typeof ForecastSchema>;
