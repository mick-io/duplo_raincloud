/* eslint-disable */
// @ts-nocheck

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Location from "../models/location.model";
import LocationsRepository from "../repositories/locations.repository";

describe("LocationsRepository", () => {
  let mongoServer: MongoMemoryServer;
  let locationsRepository: LocationsRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    locationsRepository = new LocationsRepository();
  });

  beforeEach(async () => {
    await Location.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should upsert a location", async () => {
    const location = { latitude: 10, longitude: 20 };
    const result = await locationsRepository.upsert(location);

    expect(result).toMatchObject(location);
  });

  it("should list all locations", async () => {
    const location1 = { latitude: 10, longitude: 20 };
    const location2 = { latitude: 30, longitude: 40 };
    await Location.create(location1, location2);

    const locations = await locationsRepository.list();

    expect(locations).toHaveLength(2);
    expect(locations).toEqual(
      expect.arrayContaining([
        expect.objectContaining(location1),
        expect.objectContaining(location2),
      ]),
    );
  });

  it("should find a location by id", async () => {
    const location = { latitude: 10, longitude: 20 };
    const { _id } = await Location.create(location);

    const foundLocation = await locationsRepository.find(_id.toString());

    expect(foundLocation).toMatchObject(location);
  });

  it("should delete a location by id", async () => {
    const location = { latitude: 10, longitude: 20 };
    const { _id } = await Location.create(location);

    await locationsRepository.deleteById(_id.toString());

    const foundLocation = await Location.findById(_id);
    expect(foundLocation).toBeNull();
  });

  it("should throw an error when finding with an invalid ObjectId", async () => {
    await expect(locationsRepository.find("invalid")).rejects.toThrow(
      "Invalid ObjectId",
    );
  });

  it("should throw an error when deleting with an invalid ObjectId", async () => {
    await expect(locationsRepository.deleteById("invalid")).rejects.toThrow(
      "Invalid ObjectId",
    );
  });
});
