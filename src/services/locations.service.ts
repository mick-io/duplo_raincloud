import { FilterQuery, Types } from "mongoose";

import LocationModel from "../database/models/location.model";
import { InvalidArgumentError } from "../errors";
import { LocationLeanDocument } from "../types/database";
import { Location } from "../types/location";
import { ILocationsService } from "../types/services";
import ForecastService from "./forecast.service";

interface IDependencies {
  locationRepository: typeof LocationModel;
  forecastService: ForecastService;
}

export default class LocationsService implements ILocationsService {
  private readonly locations;
  private readonly forecastService;

  constructor({ locationRepository, forecastService }: IDependencies) {
    this.locations = locationRepository;
    this.forecastService = forecastService;
  }

  async listLocations(
    filter: FilterQuery<Location> = {},
  ): Promise<LocationLeanDocument[]> {
    const locations = await this.locations
      .find(filter)
      .lean({ versionKey: false });
    return locations;
  }

  async storeLocation(
    location: Location,
  ): Promise<LocationLeanDocument | null> {
    const { latitude, longitude, ...rest } = location;
    const filter = { latitude, longitude };
    const update = { ...rest };

    const doc = await this.locations
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        runValidators: true,
      })
      .lean({ versionKey: false });

    try {
      await this.forecastService.fetchAndStoreForecast(doc);
    } catch (error) {
      this.locations.deleteOne({ _id: doc._id });
      throw error;
    }

    return doc;
  }

  async deleteLocation(args: Location): Promise<boolean> {
    const { deletedCount } = await this.locations.deleteOne(args);
    return deletedCount > 0;
  }

  async deleteLocationById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidArgumentError("Invalid ID");
    }
    const { deletedCount } = await this.locations.deleteOne({ _id: id });
    return deletedCount > 0;
  }
}
