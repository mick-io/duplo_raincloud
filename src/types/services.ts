import { FilterQuery } from "mongoose";

import { OpenMeteoHourlyTempResponseBody } from "../types/api";
import { Location } from "../types/location";
import { ForecastLeanDocument, LocationLeanDocument } from "./database";
import { Forecast } from "./forecast";

export interface IForecastService {
  fetchAndStoreForecast(location: Location): Promise<ForecastLeanDocument>;
  fetchForecast(location: Location): Promise<Forecast>;
  storeForecast(
    location: Location,
    forecast: Forecast,
  ): Promise<ForecastLeanDocument>;
  getLatest(): Promise<ForecastLeanDocument[]>;
  listForecasts(): Promise<ForecastLeanDocument[]>;
}
export interface ILocationsService {
  listLocations(
    filter?: FilterQuery<Location>,
  ): Promise<LocationLeanDocument[]>;
  storeLocation(location: Location): Promise<LocationLeanDocument | null>;
  deleteLocation(args: Location): Promise<boolean>;
  deleteLocationById(id: string): Promise<boolean>;
}

export interface IWeatherApiService {
  healthCheck(): Promise<boolean>;
  fetchHourlyForecast(
    location: Location,
  ): Promise<OpenMeteoHourlyTempResponseBody>;
}
