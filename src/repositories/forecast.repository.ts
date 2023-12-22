import { ForecastDTO } from "../dtos";
import Forecast from "../models/forecast.model";

export default class ForecastRepository {
  async upsert(forecast: ForecastDTO) {
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
