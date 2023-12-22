import axios from "axios";

import { ConfigType } from "../config";
import { ForecastDTO, ForecastResponse } from "../dtos";
import ForecastRepository from "../repositories/forecast.repository";
import { ForecastDTOSchema } from "../schemas/forecast.schema";
import LocationsService from "./locations.service";

interface IDependencies {
  config: ConfigType;
  forecastRepository: ForecastRepository;
  locationService: LocationsService;
}

export default class ForecastService {
  private readonly config;
  private readonly forecastsRepository;
  private readonly locationService;

  constructor({ config, forecastRepository, locationService }: IDependencies) {
    this.config = config;
    this.forecastsRepository = forecastRepository;
    this.locationService = locationService;
  }

  async getLatest() {
    const locations = await this.locationService.listLocations();

    const promises = locations.map(async ({ latitude, longitude }) => {
      const forecast = await this.fetchForecast(latitude, longitude);
      const doc = await this.forecastsRepository.upsert(forecast);
      return doc.toObject({ versionKey: false });
    });

    const forecast = await Promise.all(promises);
    return forecast.map((forecast) => this.formatForecast(forecast));
  }

  async listForecasts() {
    const locations = await this.locationService.listLocations();

    const promises = locations.map(async ({ latitude, longitude }) => {
      let doc = await this.forecastsRepository.find(latitude, longitude);

      if (!doc) {
        const forecast = await this.fetchForecast(latitude, longitude);
        doc = await this.forecastsRepository.upsert(forecast);
      }
      return doc.toObject({ versionKey: false });
    });

    const forecasts = await Promise.all(promises);
    return forecasts.map((forecast) => this.formatForecast(forecast));
  }

  async getForecast(latitude: number, longitude: number) {
    const doc = await this.forecastsRepository.find(latitude, longitude);
    if (!doc) {
      return null;
    }
    return this.formatForecast(doc);
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

    return ForecastDTOSchema.parse(resp.data);
  }

  private formatForecast(dto: ForecastDTO): ForecastResponse {
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
