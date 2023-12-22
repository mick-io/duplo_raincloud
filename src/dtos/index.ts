import { z } from "zod";

import { ForecastDTOSchema } from "../schemas/forecast.schema";
import {
  AddLocationDTOSchema,
  DeleteLocationDTOSchema,
  ListLocationDTOSchema,
} from "../schemas/location.schema";

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  forecast: {
    time: string;
    high: string;
    low: string;
  }[];
}

export type AddLocationDTO = z.infer<typeof AddLocationDTOSchema>;
export type ListLocationDTO = z.infer<typeof ListLocationDTOSchema>;
export type DeleteLocationDTO = z.infer<typeof DeleteLocationDTOSchema>;

export type ForecastDTO = z.infer<typeof ForecastDTOSchema>;
