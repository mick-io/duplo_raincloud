/* eslint-disable */
// @ts-nocheck

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import Forecast, { IForecast } from "../models/forecast.model";
import ForecastRepository from "../repositories/forecast.repository";

describe("ForecastRepository", () => {
  let mongoServer: MongoMemoryServer;
  let forecastRepository: ForecastRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    forecastRepository = new ForecastRepository();
  });

  beforeEach(async () => {
    await Forecast.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should upsert a forecast", async () => {
    const forecast: IForecast = {
      latitude: 10,
      longitude: 20,
      hourly_units: {
        temperature_2m: "15",
        time: new Date().toISOString(),
      },
      elevation: 100,
      timezone_abbreviation: "EST",
      timezone: "America/New_York",
      utc_offset_seconds: -18000,
      generationtime_ms: 1000,
    };

    const result = await forecastRepository.upsert(forecast);

    expect(result).toMatchObject(forecast);
    const dbForecast = await Forecast.findOne({
      latitude: forecast.latitude,
      longitude: forecast.longitude,
    });
    expect(dbForecast).toMatchObject(forecast);
  });

  it("should list all forecasts", async () => {
    const forecast1 = {
      latitude: 10,
      longitude: 20,
      hourly_units: {
        temperature_2m: 15,
        time: new Date(),
      },
      elevation: 100,
      timezone_abbreviation: "EST",
      timezone: "America/New_York",
      utc_offset_seconds: -18000,
      generationtime_ms: 1000,
    };

    const forecast2 = {
      latitude: 30,
      longitude: 40,
      hourly_units: {
        temperature_2m: 25,
        time: new Date(),
      },
      elevation: 200,
      timezone_abbreviation: "PST",
      timezone: "America/Los_Angeles",
      utc_offset_seconds: -28800,
      generationtime_ms: 2000,
    };
    await Forecast.create(forecast1, forecast2);
    const forecasts = await forecastRepository.list();

    expect(forecasts).toHaveLength(2);
    forecasts.forEach((forecast) => {
      expect(forecast).toHaveProperty("latitude");
      expect(forecast).toHaveProperty("longitude");
      expect(forecast).toHaveProperty("hourly_units");
      expect(forecast).toHaveProperty("elevation");
      expect(forecast).toHaveProperty("timezone_abbreviation");
      expect(forecast).toHaveProperty("timezone");
      expect(forecast).toHaveProperty("utc_offset_seconds");
      expect(forecast).toHaveProperty("generationtime_ms");
    });
  });
});
