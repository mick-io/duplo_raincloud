import Forecast from "../models/forecast.model";
import { Forecast as ForecastType } from "../schemas/forecast.schema";

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

  async deleteAll() {
    const { deletedCount } = await Forecast.deleteMany();
    return deletedCount;
  }
}
