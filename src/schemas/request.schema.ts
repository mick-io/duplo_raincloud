import { z } from "zod";

import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
} from "../constants";
import { isValidObjectId } from "mongoose";

export const PostLocationRequestBodySchema = z.object({
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((n) => !isNaN(n) && n >= MIN_LATITUDE && n <= MAX_LATITUDE, {
      message: `Latitude must be a number between ${MIN_LATITUDE} and ${MAX_LATITUDE}`,
    }),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((n) => !isNaN(n) && n >= MIN_LONGITUDE && n <= MAX_LONGITUDE, {
      message: `Longitude must be a number between ${MIN_LONGITUDE} and ${MAX_LONGITUDE}`,
    }),
});

export const GetLocationsRequestBodySchema =
  PostLocationRequestBodySchema.partial();

export const DeleteLocationRequestQuerySchema = PostLocationRequestBodySchema;

export const DeleteLocationByIdRequestParamsSchema = z.object({
  id: z.string().refine(isValidObjectId, "Invalid database ID"),
});
