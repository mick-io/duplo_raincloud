/* eslint-disable */
// @ts-nocheck

import ForecastService from "../services/forecast.service";
import ForecastRepository from "../repositories/forecast.repository";
import { ForecastDTO } from "../dtos";

describe("ForecastService", () => {
  let service: ForecastService;
  let mockRepository: jest.Mocked<ForecastRepository>;

  beforeEach(() => {
    mockRepository = {
      get: jest.fn(),
      list: jest.fn(),
      upsert: jest.fn(),
    } as any;

    service = new ForecastService({
      config: {},
      forecastRepository: mockRepository,
    });
  });

  it("should return null if no forecast is found", async () => {
    mockRepository.get.mockResolvedValue(null);

    const result = await service.getForecast(0, 0);

    expect(result).toBeNull();
    expect(mockRepository.get).toHaveBeenCalledWith(0, 0);
  });

  it("should return a formatted forecast if found", async () => {
    const mockForecastDto: ForecastDTO = {
      latitude: 0,
      longitude: 0,
      generationtime_ms: 0,
      utc_offset_seconds: 0,
      timezone: "UTC",
      timezone_abbreviation: "UTC",
      elevation: 0,
      daily_units: {
        time: "00:00",
        temperature_2m_max: "20",
        temperature_2m_min: "10",
      },
      daily: {
        time: ["00:00", "01:00"],
        temperature_2m_max: [20, 21],
        temperature_2m_min: [10, 11],
      },
    };

    const mockForecast = {
      toObject: jest.fn().mockReturnValue(mockForecastDto),
    };

    mockRepository.get.mockResolvedValue(mockForecast);

    const result = await service.getForecast(0, 0);

    expect(result.latitude).toEqual(mockForecastDto.latitude);
    expect(result.longitude).toEqual(mockForecastDto.longitude);
    expect(result.forecast.length).toEqual(mockForecastDto.daily.time.length);

    result.forecast.forEach((forecast, i) => {
      expect(forecast.time).toEqual(mockForecastDto.daily.time[i]);
    });

    expect(mockRepository.get).toHaveBeenCalledWith(0, 0);
  });
});
