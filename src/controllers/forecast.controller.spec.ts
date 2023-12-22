/* eslint-disable */
// @ts-nocheck

import ForecastController from "../controllers/forecast.controller";
import ForecastService from "../services/forecast.service";

describe("ForecastController", () => {
  let forecastService: jest.Mocked<ForecastService>;
  let forecastController: ForecastController;

  beforeEach(() => {
    forecastService = {
      listForecasts: jest.fn(),
      getLatest: jest.fn(),
    };
    forecastController = new ForecastController({ forecastService });
  });

  it("should list all forecasts", async () => {
    const mockForecasts = [{ id: 1 }, { id: 2 }];
    forecastService.listForecasts.mockResolvedValue(mockForecasts);

    const mockReq: any = {};
    const mockRes: any = {
      json: jest.fn(),
    };

    await forecastController.listForecasts(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockForecasts);
  });

  it("should get the latest forecast", async () => {
    const mockForecast = { id: 1 };
    forecastService.getLatest.mockResolvedValue(mockForecast);

    const mockReq: any = {};
    const mockRes: any = {
      json: jest.fn(),
    };

    await forecastController.getLatest(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockForecast);
  });
});
