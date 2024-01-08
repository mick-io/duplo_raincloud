/* eslint-disable */
// @ts-nocheck

import { MongooseError } from "mongoose";

import { faker } from "@faker-js/faker";

import LocationsController from "../controllers/locations.controller";
import { ExternalApiError } from "../errors";
import LocationsService from "../services/locations.service";

describe("LocationsController", () => {
  let locationsService: jest.Mocked<LocationsService>;
  let locationsController: LocationsController;
  let req = {} as Partial<Request>;
  let res = {} as Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
      params: { id: faker.database.mongodbObjectId() },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    locationsService = {
      listLocations: jest.fn(),
      storeLocation: jest.fn(),
      deleteLocation: jest.fn(),
      deleteLocationById: jest.fn(),
    };
    locationsController = new LocationsController({
      locationService: locationsService,
    });
  });

  describe("listLocations", () => {
    it("should return a list of locations", async () => {
      const mockLocations = [{ id: 1 }, { id: 2 }];
      locationsService.listLocations.mockResolvedValue(mockLocations);

      await locationsController.listLocations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLocations);
    });

    it("should return a 503 if the database is unavailable", async () => {
      locationsService.listLocations.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await locationsController.listLocations(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 500 if an unknown error occurs", async () => {
      locationsService.listLocations.mockRejectedValue(
        new Error("Unknown error"),
      );

      await locationsController.listLocations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });

  describe("addLocation", () => {
    it("should add a location", async () => {
      const mockLocation = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };
      locationsService.storeLocation.mockResolvedValue(mockLocation);

      await locationsController.addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockLocation);
    });

    it("should return a 503 if the database is unavailable", async () => {
      locationsService.storeLocation.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await locationsController.addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 502 if the external API is unavailable", async () => {
      const errMsg = "External API unavailable";
      locationsService.storeLocation.mockRejectedValue(
        new ExternalApiError(errMsg),
      );

      await locationsController.addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.json).toHaveBeenCalledWith(errMsg);
    });

    it("should return a 500 if an unknown error occurs", async () => {
      locationsService.storeLocation.mockRejectedValue(
        new Error("Unknown error"),
      );

      await locationsController.addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location", async () => {
      const mockLocation = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      };
      locationsService.deleteLocation.mockResolvedValue(mockLocation);

      await locationsController.deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith("No Content");
    });

    it("should return a 404 if the location does not exist", async () => {
      locationsService.deleteLocation.mockResolvedValue(false);

      await locationsController.deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("Not Found");
    });

    it("should return a 503 if the database is unavailable", async () => {
      locationsService.deleteLocation.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await locationsController.deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 500 if an unknown error occurs", async () => {
      locationsService.deleteLocation.mockRejectedValue(
        new Error("Unknown error"),
      );

      await locationsController.deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });

  describe("DeleteLocationById", () => {
    it("should delete a location by id", async () => {
      locationsService.deleteLocationById.mockResolvedValue(true);

      await locationsController.deleteLocationById(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith("No Content");
    });

    it("should return a 404 if the location does not exist", async () => {
      locationsService.deleteLocationById.mockResolvedValue(false);

      await locationsController.deleteLocationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("Not Found");
    });

    it("should return a 503 if the database is unavailable", async () => {
      locationsService.deleteLocationById.mockRejectedValue(
        new MongooseError("Database unavailable"),
      );

      await locationsController.deleteLocationById(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith("Service Unavailable");
    });

    it("should return a 500 if an unknown error occurs", async () => {
      locationsService.deleteLocationById.mockRejectedValue(
        new Error("Unknown error"),
      );

      await locationsController.deleteLocationById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    });
  });
});
