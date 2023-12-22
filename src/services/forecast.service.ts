import axios from "axios";

import { ConfigType } from "../config";
import ForecastRepository from "../repositories/forecast.repository";
import { AddLocationDTO } from "../schemas/location.schema";
import LocationService from "./locations.service";

interface IDependencies {
  config: ConfigType;
  forecastRepository: ForecastRepository;
  locationService: LocationService;
}

export default class ForecastService {
  private readonly config;
  private readonly forecasts;
  private readonly locationService;

  constructor({ config, forecastRepository, locationService }: IDependencies) {
    this.config = config;
    this.forecasts = forecastRepository;
    this.locationService = locationService;
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
    const url = new URL(this.config.openMeteoBaseURL + "/forecast");

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: "temperature_2m",
    });

    url.search = params.toString();
    const resp = await axios.get(url.toString(), {});
    return this.forecasts.upsert(resp.data);
  }

  private async updateForecasts() {
    const locations = await this.locationService.listLocations({});
    const promises = locations.map((location) => this.storeForecast(location));
    return Promise.all(promises);
  }
}
