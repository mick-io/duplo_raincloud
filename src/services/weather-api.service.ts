import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

import { ConfigType } from "../config";
import { ExternalApiError } from "../errors";
import { OpenMeteoHourlyTempResponseBody } from "../types/api";
import { Location } from "../types/location";
import { IWeatherApiService } from "../types/services";

interface IDependencies {
  config: ConfigType;
}

export default class WeatherApiService implements IWeatherApiService {
  private readonly config;

  constructor({ config }: IDependencies) {
    this.config = config;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const resp = await axios.get(this.config.openMeteoBaseURL + "/forecast");
      return resp.status === StatusCodes.OK;
    } catch (error) {
      return false;
    }
  }

  async fetchHourlyForecast(
    location: Location,
  ): Promise<OpenMeteoHourlyTempResponseBody> {
    const url = new URL(this.config.openMeteoBaseURL + "/forecast");

    url.search = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      timezone: "auto",
    }).toString();

    try {
      const resp = await axios.get<OpenMeteoHourlyTempResponseBody>(
        url.toString(),
      );
      return resp.data;
    } catch (error) {
      throw new ExternalApiError((error as AxiosError).message);
    }
  }
}
