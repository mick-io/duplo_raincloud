/* eslint-disable */
// @ts-nocheck
import axios from "axios";
import ForecastService from "./forecast.service";
import ForecastRepository from "../repositories/forecast.repository";
import LocationService from "./locations.service";

jest.mock("axios");

describe("ForecastService", () => {
  let forecastRepository: jest.Mocked<ForecastRepository>;
  let locationService: jest.Mocked<LocationService>;
  let forecastService: ForecastService;

  beforeEach(() => {
    forecastRepository = {
      list: jest.fn(),
      upsert: jest.fn(),
    };
    locationService = {
      listLocations: jest.fn(),
    };
    forecastService = new ForecastService({
      config: { openMeteoBaseURL: "http://example.com" },
      forecastRepository,
      locationService,
    });
  });

  it("should get the latest forecasts", async () => {
    const mockForecasts = [{ id: 1 }, { id: 2 }];
    forecastRepository.list.mockResolvedValue(mockForecasts);
    locationService.listLocations.mockResolvedValue([]);

    const forecasts = await forecastService.getLatest();

    expect(forecasts).toEqual(mockForecasts);
  });

  it("should list all forecasts", async () => {
    const mockForecasts = [{ id: 1 }, { id: 2 }];
    forecastRepository.list.mockResolvedValue(mockForecasts);

    const forecasts = await forecastService.listForecasts();

    expect(forecasts).toEqual(mockForecasts);
  });

  it("should store a forecast", async () => {
    const mockLocation = { latitude: 10, longitude: 20 };
    const mockForecast = { id: 1 };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockForecast });
    forecastRepository.upsert.mockResolvedValue(mockForecast);

    const forecast = await forecastService.storeForecast(mockLocation);

    expect(forecast).toEqual(mockForecast);
  });
});
