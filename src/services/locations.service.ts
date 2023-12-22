import { AddLocationDTO, DeleteLocationDTO, ListLocationDTO } from "../dtos";
import { ILocation } from "../models/location.model";
import LocationsRepository from "../repositories/locations.repository";

interface IDependencies {
  locationsRepository: LocationsRepository;
}

export default class LocationsService {
  private readonly locations;

  constructor({ locationsRepository }: IDependencies) {
    this.locations = locationsRepository;
  }

  async listLocations(dto: ListLocationDTO = {}) {
    const docs = await this.locations.list(dto);
    return docs.map((doc) => doc.toObject({ versionKey: false }));
  }

  async addLocation(dto: AddLocationDTO): Promise<ILocation | null> {
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
