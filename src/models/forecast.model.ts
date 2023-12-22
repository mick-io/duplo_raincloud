import mongoose, { Document, Schema } from "mongoose";

export interface IForecast extends Document {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: IHourlyUnits;
  hourly: IHourly;
}

interface IHourly {
  time: string[];
  temperature_2m: number[];
}

interface IHourlyUnits {
  time: string;
  temperature_2m: string;
}

const forecastSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  generationtime_ms: { type: Number, required: true },
  utc_offset_seconds: { type: Number, required: true },
  timezone: { type: String, required: true },
  timezone_abbreviation: { type: String, required: true },
  elevation: { type: Number, required: true },
  hourly_units: {
    time: { type: String, required: true },
    temperature_2m: { type: String, required: true },
  },
  hourly: {
    time: { type: [String], required: true },
    temperature_2m: { type: [Number], required: true },
  },
});

export default mongoose.model<IForecast>("Forecast", forecastSchema);
