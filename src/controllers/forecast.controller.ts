import { GET, route } from "awilix-express";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { MongooseError } from "mongoose";

import { ExternalApiError } from "../errors";
import ForecastService from "../services/forecast.service";
import {
  GetForecastErrorResponse,
  GetForecastResponseBody,
  GetLatestForecastErrorResponse,
  GetLatestForecastResponseBody,
} from "../types/response";

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
  async listForecasts(
    req: Request,
    res: Response<GetForecastResponseBody | GetForecastErrorResponse>,
  ) {
    try {
      const forecasts = await this.forecastService.listForecasts();
      return res.status(StatusCodes.OK).json(forecasts);
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }

      if (error instanceof ExternalApiError) {
        return res.status(StatusCodes.BAD_GATEWAY).json(error.message);
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  @route("/latest")
  @GET()
  async getLatest(
    req: Request,
    res: Response<
      GetLatestForecastResponseBody | GetLatestForecastErrorResponse
    >,
  ) {
    try {
      const forecasts = await this.forecastService.getLatest();
      return res.status(StatusCodes.OK).json(forecasts);
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }

      if (error instanceof ExternalApiError) {
        return res.status(StatusCodes.BAD_GATEWAY).json(error.message);
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
}
