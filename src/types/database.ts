import { Document, Types } from "mongoose";

import { Forecast } from "./forecast";
import { Location } from "./location";

export type LocationDocument = Location & Document;

export type LocationLeanDocument = Location & {
  _id: Types.ObjectId;
  __v?: string;
};

export type ForecastDocument = Forecast & Document;

export type ForecastLeanDocument = Forecast & {
  _id: Types.ObjectId;
  __v?: string;
};
