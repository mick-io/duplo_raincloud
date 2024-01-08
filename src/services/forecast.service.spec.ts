/* eslint-disable */
// @ts-nocheck
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { isValidObjectId } from "mongoose";

import { faker } from "@faker-js/faker";

import ForecastModel from "../database/models/forecast.model";
import LocationModel from "../database/models/location.model";
import ForecastService from "../services/forecast.service";
import { Forecast } from "../types/forecast";
import LocationsService from "./locations.service";
import WeatherApiService from "./weather-api.service";

describe("LocationService", () => {
  let mongoServer: MongoMemoryServer;
  let forecastService: ForecastService;
  let locationService: jest.Mocked<LocationsService>;
  let weatherApiService: jest.Mocked<WeatherApiService>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    locationService = {
      listLocations: jest.fn(),
      storeLocation: jest.fn(),
      deleteLocation: jest.fn(),
      deleteLocationById: jest.fn(),
    };

    weatherApiService = { fetchHourlyForecast: jest.fn() };

    forecastService = new ForecastService({
      locationService,
      weatherApiService,
      forecastRepository: ForecastModel,
      locationRepository: LocationModel,
    });
  });

  beforeEach(async () => {
    await ForecastModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("fetchForecast", () => {
    it("should return a forecast", async () => {
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();

      weatherApiService.fetchHourlyForecast.mockResolvedValue({
        latitude,
        longitude,
        high: 51,
      });

      const forecast = await forecastService.fetchForecast({
        latitude,
        longitude,
      });

      expect(forecast).toEqual({ latitude, longitude, high: 51 });
    });
  });

  describe("storeForecast", () => {
    it("should store a forecast", async () => {
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const forecast = { latitude, longitude };

      const doc = await forecastService.storeForecast(
        { latitude, longitude },
        forecast,
      );

      expect(doc.latitude).toEqual(latitude);
      expect(doc.longitude).toEqual(longitude);
      expect(isValidObjectId(doc._id)).toBe(true);
    });

    it("should update a forecast", async () => {
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const forecast: Partial<Forecast> = {
        latitude,
        longitude,
        elevation: 100,
      };

      await forecastService.storeForecast({ latitude, longitude }, forecast);

      const newForecast: Partial<Forecast> = {
        latitude,
        longitude,
        elevation: 200,
      };

      const doc = await forecastService.storeForecast(
        { latitude, longitude },
        newForecast,
      );

      expect(doc.latitude).toEqual(latitude);
      expect(doc.longitude).toEqual(longitude);
      expect(doc.elevation).toEqual(200);
      expect(isValidObjectId(doc._id)).toBe(true);
    });
  });
});
