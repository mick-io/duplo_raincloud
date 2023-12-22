import { ObjectId } from "mongodb";

import Location from "../models/location.model";
import { AddLocationDTO, ListLocationDTO } from "../schemas/location.schema";

export default class LocationsRepository {
  async upsert(location: AddLocationDTO) {
    const { latitude, longitude } = location;
    const doc = await Location.findOneAndUpdate(
      { latitude, longitude },
      location,
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return doc;
  }

  async list(criteria: ListLocationDTO = {}) {
    return Location.find(criteria).lean();
  }

  async find(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return Location.findById(id).lean();
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return Location.findByIdAndDelete(id).lean();
  }
}
