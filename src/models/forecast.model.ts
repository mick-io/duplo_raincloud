import mongoose, { Schema } from 'mongoose';

import { ForecastDTO as ForecastType } from '../schemas/forecast.schema';

const DailyUnitsSchema = new Schema({
  time: { type: String, required: true },
  temperature_2m_max: { type: String, required: true },
  temperature_2m_min: { type: String, required: true },
});

const DailySchema = new Schema({
  time: { type: [String], required: true },
  temperature_2m_max: { type: [Number], required: true },
  temperature_2m_min: { type: [Number], required: true },
});

const ForecastSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  generationtime_ms: { type: Number, required: true },
  utc_offset_seconds: { type: Number, required: true },
  timezone: { type: String, required: true },
  timezone_abbreviation: { type: String, required: true },
  elevation: { type: Number, required: true },
  daily_units: { type: DailyUnitsSchema, required: true },
  daily: { type: DailySchema, required: true },
});

const Forecast = mongoose.model<ForecastType>("Forecast", ForecastSchema);

export default Forecast;
