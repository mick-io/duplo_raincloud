import { before, DELETE, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { MongooseError } from "mongoose";

import { ExternalApiError, InvalidArgumentError } from "../errors";
import validate from "../middleware/validation.middleware";
import {
  DeleteLocationByIdRequestParamsSchema,
  DeleteLocationRequestQuerySchema,
  GetLocationsRequestBodySchema,
  PostLocationRequestBodySchema,
} from "../schemas/request.schema";
import LocationsService from "../services/locations.service";
import {
  DeleteLocationByIdRequestParams,
  DeleteLocationRequestQuery,
  GetLocationsRequestBody,
  PostLocationRequestBody,
} from "../types/request";
import {
  DeleteLocationResponseBody,
  GetLocationErrorResponse,
  GetLocationsResponseBody,
  PostLocationErrorResponse,
  PostLocationResponseBody,
} from "../types/response";

interface IDependencies {
  locationService: LocationsService;
}

@route("/locations")
export default class LocationsController {
  private readonly locationService;

  constructor({ locationService }: IDependencies) {
    this.locationService = locationService;
  }

  @route("/")
  @GET()
  @before([validate(GetLocationsRequestBodySchema, "query")])
  async listLocations(
    req: Request<unknown, unknown, unknown, GetLocationsRequestBody>,
    res: Response<GetLocationsResponseBody | GetLocationErrorResponse>,
  ) {
    try {
      const locations = await this.locationService.listLocations(req.query);
      if (locations) {
        return res.status(StatusCodes.OK).json(locations);
      }
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  @route("/")
  @POST()
  @before([validate(PostLocationRequestBodySchema, "body")])
  async addLocation(
    req: Request<unknown, unknown, PostLocationRequestBody>,
    res: Response<PostLocationResponseBody | PostLocationErrorResponse>,
  ) {
    const { latitude, longitude } = req.body;
    try {
      const location = await this.locationService.storeLocation({
        latitude,
        longitude,
      });

      if (location) {
        return res.status(StatusCodes.CREATED).json(location);
      }
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }

      if (error instanceof ExternalApiError) {
        return res.status(StatusCodes.BAD_GATEWAY).json(error.message);
      }
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }

  @route("/")
  @DELETE()
  @before([validate(DeleteLocationRequestQuerySchema, "query")])
  async deleteLocation(
    req: Request<unknown, unknown, unknown, DeleteLocationRequestQuery>,
    res: Response<DeleteLocationResponseBody>,
  ) {
    try {
      const ok = await this.locationService.deleteLocation(req.query);
      if (!ok) {
        return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
      return res.status(StatusCodes.NO_CONTENT).json(ReasonPhrases.NO_CONTENT);
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  @route("/:id")
  @DELETE()
  @before([validate(DeleteLocationByIdRequestParamsSchema, "params")])
  async deleteLocationById(
    req: Request<DeleteLocationByIdRequestParams, unknown, unknown, unknown>,
    res: Response<DeleteLocationResponseBody>,
  ) {
    try {
      const { id } = req.params;
      const ok = await this.locationService.deleteLocationById(id);
      if (!ok) {
        return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
      return res.status(StatusCodes.NO_CONTENT).json(ReasonPhrases.NO_CONTENT);
    } catch (error) {
      if (error instanceof MongooseError) {
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .json(ReasonPhrases.SERVICE_UNAVAILABLE);
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
}
