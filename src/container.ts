import { asClass, asValue, createContainer } from "awilix";

import config, { ConfigType } from "./config";
import ForecastController from "./controllers/forecast.controller";
import LocationsController from "./controllers/locations.controller";
import RootController from "./controllers/root.controller";
import ForecastModel from "./database/models/forecast.model";
import LocationModel from "./database/models/location.model";
import ForecastService from "./services/forecast.service";
import LocationsService from "./services/locations.service";
import WeatherApiService from "./services/weather-api.service";
import {
  IForecastService,
  ILocationsService,
  IWeatherApiService,
} from "./types/services";

interface IContainer {
  config: ConfigType;
  rootController: RootController;
  locationController: LocationsController;
  forecastController: ForecastController;
  locationService: ILocationsService;
  forecastService: IForecastService;
  weatherApiService: IWeatherApiService;
  forecastRepository: typeof ForecastModel;
  locationRepository: typeof LocationModel;
}

const container = createContainer<IContainer>();

container.register({
  config: asValue(config),
  rootController: asClass(RootController),
  locationController: asClass(LocationsController),
  forecastController: asClass(ForecastController),
  locationService: asClass(LocationsService).scoped(),
  forecastService: asClass(ForecastService).scoped(),
  weatherApiService: asClass(WeatherApiService).scoped(),
  forecastRepository: asValue(ForecastModel),
  locationRepository: asValue(LocationModel),
});

export default container;
