import axios from "axios";

import { ConfigType } from "../config";
import ForecastRepository from "../repositories/forecast.repository";
import { ForecastDTO, ForecastSchema } from "../schemas/forecast.schema";
import { AddLocationDTO } from "../schemas/location.schema";

interface IDependencies {
  config: ConfigType;
  forecastRepository: ForecastRepository;
}

export default class ForecastService {
  private readonly config;
  private readonly forecastsRepository;

  constructor({ config, forecastRepository }: IDependencies) {
    this.config = config;
    this.forecastsRepository = forecastRepository;
  }

  async getLatest() {
    await this.updateForecasts();
    return this.listForecasts();
  }

  async listForecasts() {
    const docs = await this.forecastsRepository.list();
    const forecasts = docs.map((doc) => doc.toObject({ versionKey: false }));

    return forecasts.map((forecast) => this.formatForecast(forecast));
  }

  async getForecast(latitude: number, longitude: number) {
    const doc = await this.forecastsRepository.get(latitude, longitude);
    if (!doc) {
      return null;
    }
    const forecast = doc.toObject({ versionKey: false });
    return this.formatForecast(forecast);
  }

  async storeForecast(location: AddLocationDTO) {
    const { latitude, longitude } = location;
    const forecast = await this.fetchForecast(latitude, longitude);
    return this.forecastsRepository.upsert(forecast);
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
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      timezone: "auto",
    });

    url.search = params.toString();
    const resp = await axios.get<ForecastDTO>(url.toString());

    return ForecastSchema.parse(resp.data);
  }

  private formatForecast(dto: ForecastDTO) {
    const { latitude, longitude, daily, daily_units } = dto;
    const { temperature_2m_max, temperature_2m_min, time } = daily;

    const forecast = time.map((time, i) => {
      const high = temperature_2m_max[i] + daily_units.temperature_2m_max;
      const low = temperature_2m_min[i] + daily_units.temperature_2m_min;
      return { time, high, low };
    });

    return { latitude, longitude, forecast };
  }
}
