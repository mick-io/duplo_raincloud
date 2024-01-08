/* eslint-disable */
// @ts-nocheck

import axios from "axios";
import WeatherApiService from "./weather-api.service";
import { StatusCodes } from "http-status-codes";
import { ExternalApiError } from "../errors";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("WeatherApiService", () => {
  const config = {
    openMeteoBaseURL: "http://example.com",
  };

  const service = new WeatherApiService({ config });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("healthCheck", () => {
    it("should return true when the status is OK", async () => {
      mockedAxios.get.mockResolvedValue({ status: StatusCodes.OK });

      const result = await service.healthCheck();

      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        config.openMeteoBaseURL + "/forecast",
      );
    });

    it("should return false when an error occurs", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      const result = await service.healthCheck();

      expect(result).toBe(false);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        config.openMeteoBaseURL + "/forecast",
      );
    });
  });

  describe("fetchHourlyForecast", () => {
    it("should return the forecast data when the request is successful", async () => {
      const mockData = { data: "mock data" };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const location = { latitude: 40.7128, longitude: 74.006 };
      const result = await service.fetchHourlyForecast(location);

      expect(result).toBe(mockData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should throw an ExternalApiError when an error occurs", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      const location = { latitude: 40.7128, longitude: 74.006 };

      await expect(service.fetchHourlyForecast(location)).rejects.toThrow(
        ExternalApiError,
      );
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
});
