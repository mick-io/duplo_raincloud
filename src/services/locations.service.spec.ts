/* eslint-disable */
// @ts-nocheck

import LocationsService from "../services/locations.service";
import LocationsRepository from "../repositories/locations.repository";
import ForecastService from "./forecast.service";

describe("LocationsService", () => {
  let locationsRepository: jest.Mocked<LocationsRepository>;
  let forecastService: jest.Mocked<ForecastService>;
  let locationsService: LocationsService;

  beforeEach(() => {
    locationsRepository = {
      list: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    };
    forecastService = {
      storeForecast: jest.fn(),
    };
    locationsService = new LocationsService({
      locationsRepository,
      forecastService,
    });
  });

  it("should list all locations", async () => {
    const mockLocations = [{ id: "1", latitude: 10, longitude: 20 }];
    locationsRepository.list.mockResolvedValue(mockLocations);

    const locations = await locationsService.listLocations({});

    expect(locations).toEqual(mockLocations);
  });

  it("should add a location", async () => {
    const mockLocation = { id: "1", latitude: 10, longitude: 20 };
    locationsRepository.upsert.mockResolvedValue(mockLocation);

    const location = await locationsService.addLocation(mockLocation);

    expect(location).toEqual(mockLocation);
    expect(forecastService.storeForecast).toHaveBeenCalledWith(mockLocation);
  });

  it("should delete a location", async () => {
    const mockLocation = { id: "1" };
    locationsRepository.delete.mockResolvedValue(mockLocation);

    const location = await locationsService.deleteLocation("1");

    expect(location).toEqual(mockLocation);
  });
});
