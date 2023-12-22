/* eslint-disable */
// @ts-nocheck

import { StatusCodes } from "http-status-codes";
import LocationsController from "../controllers/locations.controller";
import LocationsService from "../services/locations.service";

describe("LocationsController", () => {
  let locationsService: jest.Mocked<LocationsService>;
  let locationsController: LocationsController;
  let mockRes: Record<any, any>;

  beforeEach(() => {
    locationsService = {
      listLocations: jest.fn(),
      addLocation: jest.fn(),
      deleteLocation: jest.fn(),
    };
    locationsController = new LocationsController({
      locationService: locationsService,
    });
    mockRes = {
      json: jest.fn(),
      status: jest.fn(() => mockRes),
    };
  });

  it("should list all locations", async () => {
    const mockLocations = [{ id: 1 }, { id: 2 }];
    locationsService.listLocations.mockResolvedValue(mockLocations);

    const mockReq: any = {};
    const mockRes: any = {
      json: jest.fn(),
    };

    await locationsController.listLocations(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockLocations);
  });

  it("should add a location", async () => {
    const mockLocation = { id: 1, latitude: 10, longitude: 20 };
    locationsService.addLocation.mockResolvedValue(mockLocation);

    const mockReq: any = {
      body: { latitude: 10, longitude: 20 },
    };

    await locationsController.addLocation(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockLocation);
  });

  it("should delete a location", async () => {
    const mockLocation = { id: 1 };
    locationsService.deleteLocation.mockResolvedValue(mockLocation);

    const mockReq: any = {
      query: { id: 1 },
    };

    await locationsController.deleteLocation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  });
});
