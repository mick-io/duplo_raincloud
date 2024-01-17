import ForecastModel from "../database/models/forecast.model";
import LocationModel from "../database/models/location.model";
import { ForecastLeanDocument } from "../types/database";
import { Forecast } from "../types/forecast";
import { Location } from "../types/location";
import { IForecastService, IWeatherApiService } from "../types/services";

interface IDependencies {
  locationRepository: typeof LocationModel;
  forecastRepository: typeof ForecastModel;
  weatherApiService: IWeatherApiService;
}

export default class ForecastService implements IForecastService {
  private readonly locationRepository;
  private readonly forecastsRepository;
  private readonly weatherApiService: IWeatherApiService;

  constructor({
    forecastRepository,
    locationRepository,
    weatherApiService,
  }: IDependencies) {
    this.locationRepository = locationRepository;
    this.forecastsRepository = forecastRepository;
    this.weatherApiService = weatherApiService;
  }

  async fetchForecast(location: Location): Promise<Forecast> {
    return await this.weatherApiService.fetchHourlyForecast(location);
  }

  async storeForecast(
    location: Location,
    forecast: Forecast,
  ): Promise<ForecastLeanDocument> {
    const doc = await this.forecastsRepository
      .findOneAndUpdate(
        { latitude: location.latitude, longitude: location.longitude },
        forecast,
        { new: true, upsert: true },
      )
      .lean({ versionKey: false });
    return doc;
  }

  async fetchAndStoreForecast(
    location: Location,
  ): Promise<ForecastLeanDocument> {
    const forecast = await this.fetchForecast(location);
    return await this.storeForecast(location, forecast);
  }

  async getLatest(): Promise<ForecastLeanDocument[]> {
    const locations = await this.locationRepository.find().lean();
    const promises = locations.map(async (location) => {
      return await this.fetchAndStoreForecast(location);
    });
    const forecasts = await Promise.all(promises);
    return forecasts;
  }

  async listForecasts(): Promise<ForecastLeanDocument[]> {
    const locations = await this.locationRepository.find().lean();
    const promises = locations.map(async (location) => {
      const doc = await this.forecastsRepository
        .findOne({ latitude: location.latitude, longitude: location.longitude })
        .lean({ versionKey: false });
      return doc;
    });
    const forecast = await Promise.all(promises);
    return forecast.filter((doc) => doc !== null) as ForecastLeanDocument[];
  }
}
