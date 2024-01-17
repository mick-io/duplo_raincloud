import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { isDatabaseConnected } from "../database/util";
import { IWeatherApiService } from "../types/services";
import mongoose from "mongoose";

interface IDependencies {
  weatherApiService: IWeatherApiService;
}

export default class RootController {
  private readonly weatherApiService: IWeatherApiService;

  constructor({ weatherApiService }: IDependencies) {
    this.weatherApiService = weatherApiService;
  }

  @route("/health")
  @GET()
  async health(_: Request, res: Response) {
    let status = StatusCodes.OK;
    let weatherServiceStatus: "ERROR" | "OK" = "OK";
    let databaseStatus: "ERROR" | "OK" = "OK";

    if (mongoose.connection.readyState != mongoose.ConnectionStates.connected) {
      status = StatusCodes.SERVICE_UNAVAILABLE;
      databaseStatus = "ERROR";
    }

    try {
      const ok = await this.weatherApiService.healthCheck();
      if (!ok) {
        status = StatusCodes.SERVICE_UNAVAILABLE;
        weatherServiceStatus = "ERROR";
      }
    } catch {
      status = StatusCodes.SERVICE_UNAVAILABLE;
      weatherServiceStatus = "ERROR";
    }

    res.status(status).json({
      service: "OK",
      database: databaseStatus,
      weatherService: weatherServiceStatus,
    });
  }
}
