import Forecast from "../models/forecast.model";
import { AddForecastDTO } from "../schemas/forecast.schema";

export default class ForecastRepository {
  async upsert(forecast: AddForecastDTO) {
    const { latitude, longitude } = forecast;
    const doc = await Forecast.findOneAndUpdate(
      { latitude, longitude },
      forecast,
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return doc;
  }

  async list() {
    const forecasts = await Forecast.find().lean();
    return forecasts;
  }
}
