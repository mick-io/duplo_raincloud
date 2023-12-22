/* eslint-disable */
// @ts-nocheck

import ForecastService from "../services/forecast.service";
import ForecastRepository from "../repositories/forecast.repository";
import { ForecastDTO } from "../dtos";
import { ConfigType } from "../config";

describe("ForecastService", () => {
  let forecastService: ForecastService;
  let mockForecastRepository: jest.Mocked<ForecastRepository>;
  let mockLocationsService: jest.Mocked<LocationsService>;
  let mockConfig: ConfigType;

  beforeEach(() => {
    mockForecastRepository = {
      upsert: jest.fn(),
      find: jest.fn(),
    } as any;

    mockLocationsService = {
      listLocations: jest.fn(),
    } as any;

    mockConfig = {} as ConfigType;

    forecastService = new ForecastService({
      config: mockConfig,
      forecastRepository: mockForecastRepository,
      locationService: mockLocationsService,
    });
  });

  describe("getLatest", () => {
    it("should fetch the latest forecast for each location", async () => {
      const locations = [{ latitude: 1, longitude: 1 }];
      const forecast = { temperature: 20 };
      const formattedForecast = { temperature: "20F" };
      mockLocationsService.listLocations.mockResolvedValue(locations);
      forecastService.fetchForecast = jest.fn().mockResolvedValue(forecast);
      mockForecastRepository.upsert.mockResolvedValue({
        toObject: () => forecast,
      });
      forecastService.formatForecast = jest
        .fn()
        .mockReturnValue(formattedForecast);

      const result = await forecastService.getLatest();

      expect(mockLocationsService.listLocations).toHaveBeenCalled();
      expect(forecastService.fetchForecast).toHaveBeenCalledWith(1, 1);
      expect(mockForecastRepository.upsert).toHaveBeenCalledWith(forecast);
      expect(forecastService.formatForecast).toHaveBeenCalledWith(forecast);
      expect(result).toEqual([formattedForecast]);
    });
  });

  describe("listForecasts", () => {
    it("should list forecasts for each location", async () => {
      const locations = [{ latitude: 1, longitude: 1 }];
      const forecast = { temperature: 20 };
      const formattedForecast = { temperature: "20F" };
      mockLocationsService.listLocations.mockResolvedValue(locations);
      mockForecastRepository.find.mockResolvedValue(null);
      forecastService.fetchForecast = jest.fn().mockResolvedValue(forecast);
      mockForecastRepository.upsert.mockResolvedValue({
        toObject: () => forecast,
      });
      forecastService.formatForecast = jest
        .fn()
        .mockReturnValue(formattedForecast);

      const result = await forecastService.listForecasts();

      expect(mockLocationsService.listLocations).toHaveBeenCalled();
      expect(mockForecastRepository.find).toHaveBeenCalledWith(1, 1);
      expect(forecastService.fetchForecast).toHaveBeenCalledWith(1, 1);
      expect(mockForecastRepository.upsert).toHaveBeenCalledWith(forecast);
      expect(forecastService.formatForecast).toHaveBeenCalledWith(forecast);
      expect(result).toEqual([formattedForecast]);
    });
  });
});
