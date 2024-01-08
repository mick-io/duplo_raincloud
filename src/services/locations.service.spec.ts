/* eslint-disable */
// @ts-nocheck
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { faker } from "@faker-js/faker";

import LocationModel from "../database/models/location.model";
import LocationsService from "../services/locations.service";
import { Location } from "../types/location";
import ForecastService from "./forecast.service";

describe("LocationService", () => {
  let mongoServer: MongoMemoryServer;
  let locationsService: LocationsService;
  let forecastService: ForecastService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    forecastService = { fetchAndStoreForecast: jest.fn() };

    locationsService = new LocationsService({
      locationRepository: LocationModel,
      forecastService,
    });
  });

  beforeEach(async () => {
    await LocationModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("listLocations", () => {
    it("should return all locations", async () => {
      const locations: Location[] = [];

      for (let i = 0; i < 5; i++) {
        const location = {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };
        locations.push(location);
      }

      await LocationModel.insertMany(locations);

      const result = await locationsService.listLocations();

      expect(result).toHaveLength(locations.length);

      for (let i = 0; i < locations.length; i++) {
        const input = locations[i];
        const output = result[i];
        expect(input.latitude).toBe(output.latitude);
        expect(input.longitude).toBe(output.longitude);
        expect(output._id).toBeDefined();
      }
    });

    it("should return locations filtered by latitude", async () => {
      const locations: Location[] = [];

      for (let i = 0; i < 5; i++) {
        const location = {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };
        locations.push(location);
      }

      await LocationModel.insertMany(locations);

      const result = await locationsService.listLocations({
        latitude: locations[0].latitude,
      });

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBe(locations[0].latitude);
      expect(result[0].longitude).toBe(locations[0].longitude);
    });

    it("should return locations filtered by longitude", async () => {
      const locations: Location[] = [];

      for (let i = 0; i < 5; i++) {
        const location = {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };
        locations.push(location);
      }

      await LocationModel.insertMany(locations);

      const result = await locationsService.listLocations({
        longitude: locations[0].longitude,
      });

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBe(locations[0].latitude);
      expect(result[0].longitude).toBe(locations[0].longitude);
    });

    it("should return locations filtered by latitude and longitude", async () => {
      const locations: Location[] = [];

      for (let i = 0; i < 5; i++) {
        const location = {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };
        locations.push(location);
      }

      await LocationModel.insertMany(locations);

      const result = await locationsService.listLocations({
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
      });

      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBe(locations[0].latitude);
      expect(result[0].longitude).toBe(locations[0].longitude);
    });

    it("should return empty array if no location is found", async () => {
      const result = await locationsService.listLocations();
      expect(result).toHaveLength(0);
    });
  });

  describe("storeLocation", () => {
    it("should store a new location", async () => {
      const location = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };

      const result = await locationsService.storeLocation({ ...location });
      const count = await LocationModel.countDocuments({ ...location });

      expect(count).toBe(1);
      expect(result).toBeDefined();
      expect(result!.latitude).toBe(location.latitude);
      expect(result!.longitude).toBe(location.longitude);
    });

    it("should update an existing location", async () => {
      const location = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };

      await LocationModel.create(location);

      const result = await locationsService.storeLocation({ ...location });
      const count = await LocationModel.countDocuments({ ...location });

      expect(count).toBe(1);
      expect(result).toBeDefined();
      expect(result!.latitude).toBe(location.latitude);
      expect(result!.longitude).toBe(location.longitude);
    });

    it("should throw an error if location is invalid", async () => {
      const location = {
        latitude: faker.location.latitude(),
      };

      try {
        // @ts-ignore
        await locationsService.storeLocation(location);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location by latitude and longitude", async () => {
      const location = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };

      await LocationModel.create(location);

      const result = await locationsService.deleteLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      const count = await LocationModel.countDocuments({ ...location });

      expect(result).toBe(true);
      expect(count).toBe(0);
    });

    it("should delete a location by id", async () => {
      const location = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };

      const { _id } = await LocationModel.create(location);

      const result = await locationsService.deleteLocation(_id);
      const count = await LocationModel.countDocuments({ ...location });

      expect(result).toBe(true);
      expect(count).toBe(0);
    });

    it("should throw an error if location is invalid", async () => {
      const location = {
        latitude: faker.location.latitude(),
      };

      try {
        // @ts-ignore
        await locationsService.deleteLocation(location);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it("should return false if location is not found", async () => {
      const result = await locationsService.deleteLocation({
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      });

      expect(result).toBe(false);
    });

    it("should return false if location id is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const result = await locationsService.deleteLocation(id);

      expect(result).toBe(false);
    });
  });
});
