import LocationsRepository from "../repositories/locations.repository";
import { AddLocationDTO } from "../schemas/location.schema";
import ForecastService from "./forecast.service";

interface IDependencies {
  locationsRepository: LocationsRepository;
  forecastService: ForecastService;
}

export default class LocationsService {
  private readonly locations;
  private readonly forecastService;

  constructor({ locationsRepository, forecastService }: IDependencies) {
    this.locations = locationsRepository;
    this.forecastService = forecastService;
  }

  async listLocations(criteria: Partial<AddLocationDTO>) {
    return this.locations.list(criteria);
  }

  async addLocation(location: AddLocationDTO) {
    await this.forecastService.storeForecast(location);
    return this.locations.upsert(location);
  }

  async deleteLocation(id: string) {
    return this.locations.delete(id);
  }
}
