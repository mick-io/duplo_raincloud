import { ObjectId } from "mongodb";

import { AddLocationDTO, ListLocationDTO } from "../dtos";
import Location from "../models/location.model";

export default class LocationsRepository {
  async upsert(location: AddLocationDTO) {
    const { latitude, longitude } = location;
    const doc = await Location.findOneAndUpdate(
      { latitude, longitude },
      location,
      { upsert: true, new: true, runValidators: true },
    );
    return doc;
  }

  async list(criteria: ListLocationDTO = {}) {
    return Location.find(criteria);
  }

  async find(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return Location.findById(id);
  }

  async delete(latitude: number, longitude: number) {
    const doc = await Location.findOneAndDelete({ latitude, longitude });
    return doc;
  }

  async deleteById(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return Location.findByIdAndDelete(id);
  }
}
