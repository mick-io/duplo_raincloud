import { before, DELETE, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import validate from "../middleware/validation.middleware";
import {
  AddLocationDTO,
  AddLocationDTOSchema,
  DeleteLocationDTO,
  DeleteLocationDTOSchema,
  ListLocationDTO,
  ListLocationDTOSchema,
} from "../schemas/location.schema";
import LocationsService from "../services/locations.service";

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
  @before([validate(ListLocationDTOSchema, "query")])
  async listLocations(
    req: Request<unknown, unknown, unknown, ListLocationDTO>,
    res: Response,
  ) {
    const locations = await this.locationService.listLocations(req.query);
    res.json(locations);
  }

  @route("/")
  @POST()
  @before([validate(AddLocationDTOSchema, "body")])
  async addLocation(
    req: Request<unknown, unknown, AddLocationDTO>,
    res: Response,
  ) {
    const { latitude, longitude } = req.body;
    try {
      const loc = await this.locationService.addLocation({
        latitude,
        longitude,
      });
      res.json(loc);
    } catch (error) {
      // TODO: Create and check for custom error if OpenMeteo call fails.
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  @route("/")
  @DELETE()
  @before([validate(DeleteLocationDTOSchema, "query")])
  async deleteLocation(
    req: Request<unknown, unknown, unknown, DeleteLocationDTO>,
    res: Response,
  ) {
    try {
      let status = StatusCodes.NO_CONTENT;
      let message = ReasonPhrases.NO_CONTENT;

      const ok = await this.locationService.deleteLocation(req.query);

      if (!ok) {
        status = StatusCodes.NOT_FOUND;
        message = ReasonPhrases.NOT_FOUND;
      }

      res.status(status).json(message);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        res.status(StatusCodes.BAD_REQUEST).json(ReasonPhrases.BAD_REQUEST);
      }
    }
  }
}
