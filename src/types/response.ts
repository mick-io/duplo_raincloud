import { OpenMeteoHourlyTempResponseBody } from "./api";
import { Location } from "./location";

export type PostLocationResponseBody = Location;

export type GetLocationsResponseBody = Location[];

export type DeleteLocationResponseBody = string;

export type GetForecastResponseBody = OpenMeteoHourlyTempResponseBody[];

export type GetLatestForecastResponseBody = OpenMeteoHourlyTempResponseBody[];

export type PostLocationErrorResponse = string;

export type GetLocationErrorResponse = string;

export type GetForecastErrorResponse = string;

export type GetLatestForecastErrorResponse = string;
