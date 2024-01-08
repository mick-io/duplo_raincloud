import { asClass, asValue, createContainer } from "awilix";

import config, { ConfigType } from "./config";
import ForecastController from "./controllers/forecast.controller";
import LocationsController from "./controllers/locations.controller";
import ForecastModel from "./database/models/forecast.model";
import LocationModel from "./database/models/location.model";
import ForecastService from "./services/forecast.service";
import LocationsService from "./services/locations.service";
import WeatherApiService from "./services/weather-api.service";

interface IContainer {
  config: ConfigType;
  locationController: LocationsController;
  locationService: LocationsService;
  forecastController: ForecastController;
  forecastService: ForecastService;
  weatherApiService: WeatherApiService;
  forecastRepository: typeof ForecastModel;
  locationRepository: typeof LocationModel;
}

const container = createContainer<IContainer>();

container.register({
  config: asValue(config),
  locationController: asClass(LocationsController),
  forecastController: asClass(ForecastController),
  locationService: asClass(LocationsService).scoped(),
  forecastService: asClass(ForecastService).scoped(),
  weatherApiService: asClass(WeatherApiService).scoped(),
  forecastRepository: asValue(ForecastModel),
  locationRepository: asValue(LocationModel),
});

export default container;
