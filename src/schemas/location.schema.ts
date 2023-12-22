import { ObjectId } from "mongodb";
import { z } from "zod";

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

export const AddLocationDTOSchema = z.object({
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

export const ListLocationDTOSchema = AddLocationDTOSchema.partial();

export const DeleteLocationDTOSchema = z.union([
  AddLocationDTOSchema,
  z.object({
    id: z
      .string()
      .refine((id) => ObjectId.isValid(id), "ID must be a valid ObjectId"),
  }),
]);

export type AddLocationDTO = z.infer<typeof AddLocationDTOSchema>;
export type ListLocationDTO = z.infer<typeof ListLocationDTOSchema>;
export type DeleteLocationDTO = z.infer<typeof DeleteLocationDTOSchema>;
