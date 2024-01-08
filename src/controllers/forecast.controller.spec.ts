/* eslint-disable */
// @ts-nocheck
import { Request, Response } from "express";
import { MongooseError } from "mongoose";

import ForecastController from "../controllers/forecast.controller";
import { ExternalApiError } from "../errors";
import ForecastService from "../services/forecast.service";

describe("ForecastController", () => {
  let forecastService: jest.Mocked<ForecastService>;
  let forecastController: ForecastController;
  let req = {} as Partial<Request>;
  let res = {} as Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    forecastService = {
      listForecasts: jest.fn(),
      getLatest: jest.fn(),
      fetchForecast: jest.fn(),
      storeForecast: jest.fn(),
      fetchAndStoreForecast: jest.fn(),
    };
    forecastController = new ForecastController({ forecastService });
  });

  describe("listForecasts", () => {
    it("should return a list of forecasts", async () => {
      const mockForecasts = [{ id: 1 }, { id: 2 }];
      forecastService.listForecasts.mockResolvedValue(mockForecasts);

      await forecastController.listForecasts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockForecasts);
    });

    it("should return a 503 if the database is unavailable", async () => {
      forecastService.listForecasts.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await forecastController.listForecasts(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 502 if the external API is unavailable", async () => {
      const errMsg = "External API unavailable";
      forecastService.listForecasts.mockRejectedValue(
        new ExternalApiError(errMsg),
      );

      await forecastController.listForecasts(req, res);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith(errMsg);
    });

    it("should return a 500 if an unexpected error occurs", async () => {
      forecastService.listForecasts.mockRejectedValue(new Error());

      await forecastController.listForecasts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });

  describe("getLatest", () => {
    it("should return the latest forecast", async () => {
      const mockForecast = { id: 1 };
      forecastService.getLatest.mockResolvedValue(mockForecast);

      await forecastController.getLatest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockForecast);
    });

    it("should return a 503 if the database is unavailable", async () => {
      forecastService.getLatest.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await forecastController.getLatest(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 502 if the external API is unavailable", async () => {
      const errMsg = "External API unavailable";
      forecastService.getLatest.mockRejectedValue(new ExternalApiError(errMsg));

      await forecastController.getLatest(req, res);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith(errMsg);
    });

    it("should return a 500 if an unexpected error occurs", async () => {
      forecastService.getLatest.mockRejectedValue(new Error());

      await forecastController.getLatest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });
});
