import axios from "axios";

import { ConfigType } from "../config";
import ForecastRepository from "../repositories/forecast.repository";
import { AddLocationDTO } from "../schemas/location.schema";

interface IDependencies {
  config: ConfigType;
  forecastRepository: ForecastRepository;
}

export default class ForecastService {
  private readonly config;
  private readonly forecasts;

  constructor({ config, forecastRepository }: IDependencies) {
    this.config = config;
    this.forecasts = forecastRepository;
  }

  async getLatest() {
    await this.updateForecasts();
    return this.listForecasts();
  }

  async listForecasts() {
    return this.forecasts.list();
  }

  async storeForecast(location: AddLocationDTO) {
    const { latitude, longitude } = location;
    const forecast = await this.fetchForecast(latitude, longitude);
    return this.forecasts.upsert(forecast);
  }

  private async updateForecasts() {
    const locations = (await this.listForecasts()).map(
      ({ latitude, longitude }) => {
        return { latitude, longitude };
      },
    );
    const promises = locations.map((location) => this.storeForecast(location));
    return Promise.all(promises);
  }

  private async fetchForecast(latitude: number, longitude: number) {
    const url = new URL(this.config.openMeteoBaseURL + "/forecast");

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: "temperature_2m",
    });

    url.search = params.toString();
    const resp = await axios.get(url.toString(), {});
    return resp.data;
  }
}
