/* eslint-disable */
// @ts-nocheck

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { ForecastDTO } from "../dtos";
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

    expect(result.latitude).toStrictEqual(forecast.latitude);
    expect(result.longitude).toStrictEqual(forecast.longitude);

    const dbForecast = await Forecast.findOne({
      latitude: forecast.latitude,
      longitude: forecast.longitude,
    });

    expect(dbForecast.latitude).toStrictEqual(forecast.latitude);
    expect(dbForecast.longitude).toStrictEqual(forecast.longitude);
  });

  it("should list all forecasts", async () => {
    const forecast1: ForecastDTO = {
      latitude: 10,
      longitude: 20,
      elevation: 100,
      timezone_abbreviation: "EST",
      timezone: "America/New_York",
      utc_offset_seconds: -18000,
      generationtime_ms: 1000,
      daily_units: {
        time: new Date().toISOString(),
        temperature_2m_max: "20",
        temperature_2m_min: "10",
      },
      daily: {
        time: [new Date().toISOString()],
        temperature_2m_max: [20],
        temperature_2m_min: [10],
      },
    };

    const forecast2: ForecastDTO = {
      latitude: 30,
      longitude: 40,
      elevation: 200,
      timezone_abbreviation: "PST",
      timezone: "America/Los_Angeles",
      utc_offset_seconds: -28800,
      generationtime_ms: 2000,
      daily_units: {
        time: new Date().toISOString(),
        temperature_2m_max: "30",
        temperature_2m_min: "20",
      },
      daily: {
        time: [new Date().toISOString()],
        temperature_2m_max: [30],
        temperature_2m_min: [20],
      },
    };

    await Forecast.create(forecast1, forecast2);
    const forecasts = await forecastRepository.list();

    expect(forecasts).toHaveLength(2);
    forecasts.forEach((forecast) => {
      expect(forecast).toHaveProperty("latitude");
      expect(forecast).toHaveProperty("longitude");
      expect(forecast).toHaveProperty("elevation");
      expect(forecast).toHaveProperty("timezone_abbreviation");
      expect(forecast).toHaveProperty("timezone");
      expect(forecast).toHaveProperty("utc_offset_seconds");
      expect(forecast).toHaveProperty("generationtime_ms");
    });
  });
});
