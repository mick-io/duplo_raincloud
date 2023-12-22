import { asClass, asValue, createContainer } from "awilix";

import config, { ConfigType } from "./config";
import ForecastController from "./controllers/forecast.controller";
import LocationsController from "./controllers/locations.controller";
import ForecastRepository from "./repositories/forecast.repository";
import LocationsRepository from "./repositories/locations.repository";
import ForecastService from "./services/forecast.service";
import LocationsService from "./services/locations.service";

interface IContainer {
  config: ConfigType;
  locationController: LocationsController;
  locationService: LocationsService;
  locationsRepository: LocationsRepository;
  forecastController: ForecastController;
  forecastService: ForecastService;
  forecastRepository: ForecastRepository;
}

const container = createContainer<IContainer>();

container.register({
  config: asValue(config),
  locationController: asClass(LocationsController),
  locationService: asClass(LocationsService).scoped(),
  locationsRepository: asClass(LocationsRepository).scoped(),
  forecastController: asClass(ForecastController),
  forecastService: asClass(ForecastService).scoped(),
  forecastRepository: asClass(ForecastRepository).scoped(),
});

export default container;
