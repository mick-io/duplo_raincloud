import LocationsRepository from "../repositories/locations.repository";
import {
  AddLocationDTO,
  DeleteLocationDTO,
  ListLocationDTO,
} from "../schemas/location.schema";
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

  async listLocations(dto: ListLocationDTO) {
    const docs = await this.locations.list(dto);
    return docs.map((doc) => doc.toObject({ versionKey: false }));
  }

  async addLocation(dto: AddLocationDTO) {
    await this.forecastService.storeForecast(dto);
    const doc = await this.locations.upsert(dto);
    return doc.toObject({ versionKey: false });
  }

  async deleteLocation(dto: DeleteLocationDTO) {
    let ok;

    if ("id" in dto) {
      ok = Boolean(await this.locations.deleteById(dto.id));
      return ok;
    }

    if ("latitude" in dto && "longitude" in dto) {
      ok = Boolean(await this.locations.delete(dto.latitude, dto.longitude));
      return ok;
    }

    throw new Error("Invalid DeleteLocationDTO");
  }
}
