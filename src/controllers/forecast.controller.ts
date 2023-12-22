import { GET, route } from "awilix-express";
import { Request, Response } from "express";

import { ForecastResponse } from "../dtos";
import ForecastService from "../services/forecast.service";

interface IDependencies {
  forecastService: ForecastService;
}

@route("/forecast")
export default class ForecastController {
  private readonly forecastService;

  constructor({ forecastService }: IDependencies) {
    this.forecastService = forecastService;
  }

  @route("/")
  @GET()
  async listForecasts(req: Request, res: Response<ForecastResponse[]>) {
    // TODO: error handling for failed request to open-meteo
    const forecasts = await this.forecastService.listForecasts();
    res.json(forecasts);
  }

  @route("/latest")
  @GET()
  async getLatest(req: Request, res: Response<ForecastResponse[]>) {
    // TODO: error handling for failed request to open-meteo
    const forecasts = await this.forecastService.getLatest();
    res.json(forecasts);
  }
}
