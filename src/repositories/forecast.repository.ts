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

  async find(latitude: number, longitude: number) {
    const doc = await Forecast.findOne({ latitude, longitude });
    return doc;
  }

  async list() {
    const forecasts = await Forecast.find();
    return forecasts;
  }
}
