import Forecast from "../models/forecast.model";
import { ForecastDTO as ForecastType } from "../schemas/forecast.schema";

export default class ForecastRepository {
  async upsert(forecast: ForecastType) {
    const { latitude, longitude } = forecast;
    const doc = await Forecast.findOneAndUpdate(
      { latitude, longitude },
      forecast,
      { upsert: true, new: true, runValidators: true },
    );
    return doc;
  }

  async list() {
    const forecasts = await Forecast.find();
    return forecasts;
  }

  async get(latitude: number, longitude: number) {
    const forecast = await Forecast.findOne({ latitude, longitude });
    return forecast;
  }
}
