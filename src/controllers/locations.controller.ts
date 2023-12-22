import { before, DELETE, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";

import validate from "../middleware/validation.middleware";
import {
  AddLocationDTO,
  ListLocationDTO,
  AddLocationDTOSchema,
  ListLocationDTOSchema,
  DeleteLocationDTO,
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
    const loc = await this.locationService.addLocation({ latitude, longitude });
    res.json(loc);
  }

  @route("/")
  @DELETE()
  @before([validate(ListLocationDTOSchema, "query")])
  async deleteLocation(
    req: Request<unknown, unknown, unknown, DeleteLocationDTO>,
    res: Response,
  ) {
    const loc = await this.locationService.deleteLocation(req.query.id);
    res.json(loc);
  }
}
