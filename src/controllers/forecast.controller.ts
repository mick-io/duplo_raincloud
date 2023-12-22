import { GET, route } from "awilix-express";
import ForecastService from "../services/forecast.service";
import { Request, Response } from "express";

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
  async listForecasts(req: Request, res: Response) {
    const forecasts = await this.forecastService.listForecasts();
    res.json(forecasts);
  }

  @route("/latest")
  @GET()
  async getLatest(req: Request, res: Response) {
    const forecasts = await this.forecastService.getLatest();
    res.json(forecasts);
  }
}
