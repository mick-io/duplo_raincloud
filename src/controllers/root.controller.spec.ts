/* eslint-disable */
// @ts-nocheck

import RootController from "./root.controller";
import { isDatabaseConnected } from "../database/util";
import { IWeatherApiService } from "../types/services";

jest.mock("../database/util");

describe("RootController", () => {
  let req = {} as Partial<Request>;
  let res = {} as Partial<Response>;
  let rootController: RootController;
  let weatherApiService: IWeatherApiService;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    weatherApiService = {
      healthCheck: jest.fn(),
      fetchHourlyForecast: jest.fn(),
    };
    rootController = new RootController({ weatherApiService });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("health", () => {
    it("should return a 200", async () => {
      (isDatabaseConnected as jest.Mock).mockReturnValue(true);
      (weatherApiService.healthCheck as jest.Mock).mockResolvedValue(true);
      await rootController.health(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return a 503 if the database is unavailable", async () => {
      (isDatabaseConnected as jest.Mock).mockReturnValue(false);
      (weatherApiService.healthCheck as jest.Mock).mockResolvedValue(true);
      await rootController.health(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        database: "ERROR",
        service: "OK",
        weatherService: "OK",
      });
    });

    it("should return a 503 if the weather service is unavailable", async () => {
      (isDatabaseConnected as jest.Mock).mockReturnValue(true);
      (weatherApiService.healthCheck as jest.Mock).mockResolvedValue(false);
      await rootController.health(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        database: "OK",
        service: "OK",
        weatherService: "ERROR",
      });
    });
  });
});
